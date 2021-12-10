import axios from "axios";

const TV_ENDPOINT = "https://www.tradingview.com/api"

async function authorize() {

    axios.post(TV_ENDPOINT + '/authorize',{
        login: process.env.login,
        password: process.env.password
    })
    .then(res => console.log(res))
    .catch( e => console.error("Unable to authorize with TradingView\n" + e ))
}

async function login() {
    
}

export default {
        authorize: authorize
}