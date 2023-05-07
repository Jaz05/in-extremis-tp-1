const axios = require('axios');
const endpoints = require("../constants/endpoints")
const { XMLParser } = require('fast-xml-parser');
const { decode } = require('metar-decoder');
const {getStartTime,registerResponseTime}  = require("../metric/hotshot_metric")
const STATION_PLACEHOLDER = "{STATION}"
const OACI_SUFFIX = "?dataSource=metars&requestType=retrieve&format=xml&stationString=" + STATION_PLACEHOLDER + "&hoursBeforeNow=1"
const ERROR_MESSAGE = "METAR report has not been obtained";
const parser = new XMLParser();

const getReport = async (stationCode) =>{
    let endpoint = endpoints.METAR_ENDPOINT + OACI_SUFFIX.replace(STATION_PLACEHOLDER, stationCode);
    let startTime = getStartTime();
    const response = await axios.get(endpoint);
    registerResponseTime(startTime, "api.metar");
    if(response.status === 200){        
        return parseResponse(response.data);
    }
    return ERROR_MESSAGE;
}

const parseResponse = (data) =>{    
    let parsed = parser.parse(data);   
    let metar = getMetar(parsed)
    let decoded = decode(metar);
    
    return decoded;    
}

const getMetar= (data) => {
    if(data.response.data.METAR.raw_text)
        return data.response.data.METAR.raw_text;
    return data.response.data.METAR[0].raw_text;
}

module.exports = { getReport };

