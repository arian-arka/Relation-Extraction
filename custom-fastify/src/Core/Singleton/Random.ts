import {nanoid as secureNanoId, customAlphabet as secureNanoAlphabet} from "nanoid/async";
import {nanoid as nonSecureNanoId, customAlphabet as nonSecureNanoAlphabet} from "nanoid/non-secure";

class Random {
    async secure(size?: number, characters?: string) {
        if (!!characters) {
            const generator = secureNanoAlphabet(characters);
            return await generator(size);
        }
        return await secureNanoId(size);
    }

    nonSecure(size?: number, characters?: string) {
        if (!!characters) {
            const generator = nonSecureNanoAlphabet(characters);
            return generator(size);
        }
        return nonSecureNanoId(size);
    }

    uuid4() {
        const { v4: uuidv4 } = require('uuid');
        return uuidv4();
    }

    uuid5(name: string, namespace: string) {
        const { v5: uuidv5 } = require('uuid');
        return uuidv5(name, namespace);
    }
}

export default new Random();