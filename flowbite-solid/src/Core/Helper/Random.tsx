import Str from "./Str";

const letters = '0123456789ABCDEF';

class Random {
    str(len = 20) {
        return Str.random(len);
    }

    number(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    colorHex(min = 0, max = 15) {
        return letters[this.number(min, max)];
    }

    color(prefix = '') {
        let color = '#' + prefix;
        for (let i = 0; i < 6 - prefix.length; i++) {
            color += this.colorHex();
        }
        return color;
    }
}

export default new Random();