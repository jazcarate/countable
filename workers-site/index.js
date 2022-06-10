import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

const DEBUG = true

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})

async function handleEvent(event) {
  let options = {}

  try {
    if (DEBUG) {
      options.cacheControl = {
        bypassCache: true,
      }
    }

    return await getAssetFromKV(event, options)
  } catch (e) {
    let pathname = new URL(event.request.url).pathname.substring(1)
    let count;
    if (pathname === "") {
      count = Math.floor(Math.random() * 1000);
    } else {
      count = parseInt(pathname)
      if (isNaN(count)) {
        count = pathname.length
      }
    }
    try {
      let replaced = await getAssetFromKV(event, {
        mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/template.html`, req),
      })

      return new HTMLRewriter().on('*', new ElementHandler(count)).transform(replaced);
    } catch (e) {
      return new Response(e.message || e.toString(), { status: 500 })
    }
  }
}

class ElementHandler {
  constructor(count) {
    this.count = count;
  }

  element(element) {
    if (element.hasAttribute('data-count')) {
      element.setInnerContent(this.count)
    }
  }
}
