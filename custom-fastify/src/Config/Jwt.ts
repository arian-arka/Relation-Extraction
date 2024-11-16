const JwtConfig: {
    key: string,
} = {
    key: process.env.JWT_TOKEN ?? ''
}

export default JwtConfig;