
const emojis = Object.entries({
    10: ["👐"],
    5: ["🖐", "🤚", "✋", "🖖"],
    3: ["🤟"],
    2: ["✌️", "🤘"],
    1: ["☝️", "👆"],
}).sort(([a], [b]) => b - a)

function toEmoji(string) {
    let n = count(string)
    if (shouldExponential(n)) {
        const { mantissa, exponent } = getNumberParts(n)
        return toEmojiNumber(mantissa) + "👍" + toEmojiNumber(exponent)
    }
    return toEmojiNumber(n)
}

function getNumberParts(x) {
    var [mantissa, exponent] = x.toExponential().split("e")
    return { mantissa, exponent }
}

function shouldExponential(number) {
    return number.toString().includes("e");
}

function count(string) {
    if (string === "") return Math.floor(Math.random() * 1000);

    let count = parseFloat(string)
    if (isNaN(count)) return string.length
    return count
}

function toEmojiNumber(number) {
    if (number == 0) return "✊"
    let ret = ""
    if (number < 0) {
        ret += "👎"
        number = -number
    }

    const [integer, fractional] = number.toString().split('.').map(Number)

    ret += toEmojiPositiveInteger(integer)
    if (fractional)
        ret += "👇" + toEmojiPositiveInteger(fractional)

    return ret
}

function toEmojiPositiveInteger(number) {
    let ret = ""
    let rng = new RNG(number)
    while (number > 0) {
        let sub = emojis.find(([n]) => n <= number)
        ret += rng.choice(sub[1])
        number -= sub[0]
    }
    return ret
}

// https://stackoverflow.com/a/424445
class RNG {
    constructor(seed) {
        this.m = 0x80000000; // 2**31;
        this.a = 1103515245;
        this.c = 12345;

        this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    }
    nextInt() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state;
    }
    nextRange(start, end) {
        // returns in range [start, end): including start, excluding end
        // can't modulu nextInt because of weak randomness in lower bits
        var rangeSize = end - start;
        var randomUnder1 = this.nextInt() / this.m;
        return start + Math.floor(randomUnder1 * rangeSize);
    }
    choice(array) {
        return array[this.nextRange(0, array.length)];
    }
}

module.exports = { toEmoji }