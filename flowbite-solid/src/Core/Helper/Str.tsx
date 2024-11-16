function dec2hex(dec) {
    return dec.toString(16).padStart(2, "0")
}
class Str{
    random(len = 20) {
        let arr = new Uint8Array((len || 40) / 2)
        window.crypto.getRandomValues(arr)
        return 'id' + Array.from(arr, dec2hex).join('')
    }
}
export default new Str();