import Response from "../Core/Class/Response";

export default {
    'default' : {
        'lang' : 'en',
        'dir' : 'ltr',
    },
    'langDir' : {
        'en' : 'ltr',
        'fa' : 'rtl'
    },


    'csrf' : {
        'enabled' : true,
        'body' : (response: Response<any>) => {
            return {
                // '_csrf' : response.props.data.token,
            }
        },
        'headers' : (response: Response<any>) => {
            return {
                'x-csrf-token' : response.props.data.token,
                '_csrf' : response.props.data.token,
            };
        }
    },
}