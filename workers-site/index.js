import { getAssetFromKV, NotFoundError } from '@cloudflare/kv-asset-handler'
import { toEmoji } from './lib'


const DEBUG = true

addEventListener('fetch', event => {
  event.respondWith(
    handleEvent(event)
      .catch(e => new Response(e.message || e.toString(), { status: 500 })))
})

async function handleEvent(event) {
  let options = {}
  if (DEBUG) {
    options.cacheControl = {
      bypassCache: true,
    }
  }

  try {
    return await getAssetFromKV(event, options)
  } catch (e) {
    if (!(e instanceof NotFoundError)) throw e

    let replaced = await getAssetFromKV(event, {
      mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/template.html`, req),
    })

    const emoji = toEmoji(new URL(event.request.url).pathname.substring(1));

    return new HTMLRewriter().on('*', new ElementHandler(emoji)).transform(replaced);
  }
}

class ElementHandler {
  constructor(toReplace) {
    this.toReplace = toReplace;
  }

  element(element) {
    if (element.hasAttribute('data-count')) {
      element.setInnerContent(this.toReplace)
    }
  }
}
