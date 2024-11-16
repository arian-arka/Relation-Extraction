const AppConfig :{
    debug : boolean
} = {
    debug : process.env.DEBUG === "true"
}
export default AppConfig;