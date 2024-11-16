const CookieConfig: {
    key: string
} = {
    key: process.env.COOKIE_TOKEN ?? ''
}

export default CookieConfig;