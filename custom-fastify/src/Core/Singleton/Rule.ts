import {validate as uuidValidate} from 'uuid';

class Rule {
    validUuid(text?: any): boolean {
        return typeof text === 'string' && !!text ? uuidValidate(text) : false;
    }
}

export default new Rule();