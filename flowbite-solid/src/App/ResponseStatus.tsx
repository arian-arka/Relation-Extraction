import Response from "../Core/Class/Response";
import Lang from "../Core/Helper/Lang";
import {Validation} from "../Core/Helper/Validator";


export default {
    '400': {
        'messages': (response: Response<any>) => {
            response.extend({'messages': response.props.data.messages});
        },
        'message': (response: Response<any>) => {
            const messages = Object.values(response.props.data.messages);
            if (messages.length)
                response.extend({
                    'message': messages[0]
                });
            else
                response.extend({
                    'message': Lang.get('response.400')
                });
        }
    },

    '-1': {
        'messages': (response: Response<any>) => {
            response.props.status = 400;
            response.extend({
                'messages': {
                    'message': Lang.get('response.unreal')
                }
            });
        },
        'message': (response: Response<any>) => {
            response.extend({
                'message': Lang.get('response.unreal')
            });
        }
    },
    '-2': {
        'messages': (response: Response<any>) => {
            response.props.isReal = true;
            response.props.status = 400;
            response.extend({
                'clientValidation': true,
                'messages':
                    (response.props.data as Validation).toObject()

            });
        },
        'message': (response: Response<any>) => {
            response.extend({
                'message': Lang.get('response.validation')
            });
        }
    },

    'default': {}

};