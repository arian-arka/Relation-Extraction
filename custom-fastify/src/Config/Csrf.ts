const CsrfConfig: {
    methods: (
        'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS'
        )[]
} = {
    methods: [
         'POST', 'PUT', 'PATCH', 'DELETE'
    ]
}

export default CsrfConfig;