const { equal } = require('assert')
const { toEmoji } = require('./lib')

describe('To emoji', () => {
    it('can render zeros', () => {
        equal(toEmoji("0"), '✊')
    })
    it('can render a number that has one emoji', () => {
        equal(toEmoji("3"), '🤟')
    })
    it('chooses one emoji when there are multiple', () => {
        equal(toEmoji("5"), '✋')
    })
    it('can render compound numbers', () => {
        equal(toEmoji(2 ** 7), '👐👐👐👐👐👐👐👐👐👐👐👐🖖🤟') //128
    })
    it('can render negative numbers', () => {
        equal(toEmoji(-7), '👎✋✌️')
    })
})
