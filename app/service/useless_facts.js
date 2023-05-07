const axios = require('axios');
const endpoints = require("../constants/endpoints")
const {getStartTime,registerResponseTime}  = require("../metric/hotshot_metric")
const RANDOM_FACTS_SUFFIX = "/api/v2/facts/random";
const ERROR_MESSAGE = "Fact has not been obtained";

const getRandomFact = async () =>{
    let startTime = getStartTime();
    const response = await axios.get(endpoints.USELESS_FACTS_ENDPOINT + RANDOM_FACTS_SUFFIX);
    registerResponseTime(startTime, "api.uselessfacts");
    if(response.status === 200){        
        return response.data["text"];
    }
    return ERROR_MESSAGE;
}


module.exports = { getRandomFact };
