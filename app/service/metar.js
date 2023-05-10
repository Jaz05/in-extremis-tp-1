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
        let parsedData = parser.parse(response.data)
        if(hasData(parsedData))
            return {status : 200 , data : decodeResponse(parsedData)};
    }
    return { status : 500, data : ERROR_MESSAGE};
}

const hasData = (data) => {
    return data.response.data && data.response.data.METAR;
}

const decodeResponse = (data) =>{    
    let metar = getMetar(data)
    let decoded = decode(metar);
    
    return decoded;    
}

const getMetar= (data) => {
    if(data.response.data.METAR.raw_text)
        return data.response.data.METAR.raw_text;
    return data.response.data.METAR[0].raw_text;
}

module.exports = { getReport };

