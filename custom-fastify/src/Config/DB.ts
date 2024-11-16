const DBConfig: {
    mongoose: {[key : string] : string},
} = {
    'mongoose': {
        'main' : process.env.MONGODB_STRING ?? 'mongodb://127.0.0.1:27017',
    },
}

export default DBConfig;