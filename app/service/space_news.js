const axios = require('axios');
const endpoints = require("../constants/endpoints")
const {getStartTime,registerResponseTime}  = require("../metric/hotshot_metric")
const TITLES_SUFFIX = "/v3/articles"
const ERROR_MESSAGE = "SpaceNews titles have not been obtained";

const getArticlesTitles = async (amount) =>{
    let startTime = getStartTime();
    const response = await axios.get(endpoints.SPACENEWS_ENDPOINT + TITLES_SUFFIX + "?_limit=" + amount);
    registerResponseTime(startTime, "api.spacenews");
    if(response.status === 200){        
        return getTitles(response.data);
    }
    return [ERROR_MESSAGE];
}

const getTitles = (articles) =>{
    titles = [];    
    articles.forEach(article => {
        titles.push(article["title"]);
    });
    
    return titles;
}

module.exports = { getArticlesTitles };

