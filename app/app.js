const spaceNewsService = require("./service/space_news");
const uselessFactsService = require("./service/useless_facts");
const metarService = require("./service/metar");
//const updateSpaceNews = require("./cron/space-news-cron");
const express = require('express');
const app = express();
const availablePorts = [3000, 3001, 3002];
const { getCache, setCache } = require("./client/redis_client")
const {getStartTime,registerResponseTime}  = require("./metric/hotshot_metric")

app.get('/ping', (req, res) => {
  let startTime = getStartTime();
  res.send('Up!')
  console.log("Pinged!")
  registerResponseTime(startTime, "endpoint.ping");
})

app.get('/space_news', (req, res) => {
  let startTime = getStartTime();
  spaceNewsService.getArticlesTitles(5).then((response) => {    
    res.statusCode = response.status;
    res.send(JSON.stringify(response.data));
    registerResponseTime(startTime, "endpoint.spacenews");
  })
  
})

app.get('/space_news_cache', async (req, res) => {
  let startTime = getStartTime();
  let foundCache = await getCache("space_news")
  if (foundCache != null) {
    res.send(foundCache);
    registerResponseTime(startTime, "endpoint.spacenews");
  } else {
    spaceNewsService.getArticlesTitles(5).then((response) => {
      res.statusCode = response.status;
      res.send(JSON.stringify(response.data));
      registerResponseTime(startTime, "endpoint.spacenews");
    })
  }
})

app.get('/fact', (req, res) => {
  let startTime = getStartTime();
  uselessFactsService.getRandomFact().then((response) => {
    res.statusCode = response.status;
    res.send(response.data);
    registerResponseTime(startTime, "endpoint.uselessfacts");
  })
  
})

app.get('/metar', (req, res) => {
  let startTime = getStartTime();
  metarService.getReport(req.query.station).then((response) => {
    res.statusCode = response.status;
    res.send(JSON.stringify(response.data));
    registerResponseTime(startTime, "endpoint.metar");
  })
  
})

app.get('/metar_cache', async (req, res) => {  
  let startTime = getStartTime();
  let cacheKey = "metar_" + req.query.station;
  let foundCache = await getCache(cacheKey)
  if (foundCache != null) {    
    res.send(foundCache);
    registerResponseTime(startTime, "endpoint.metar");  
  } else {
    metarService.getReport(req.query.station).then((response) => {
      res.statusCode = response.status;
      let jsonResponse = JSON.stringify(response.data);
      setCache(cacheKey, jsonResponse, 300);
      res.send(jsonResponse);
      registerResponseTime(startTime, "endpoint.metar");  
    })
  }
  
})


function startServer(port) {
  app.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
}

function tryNextPort(ports) {
  if (ports.length === 0) {
    console.error('Not available ports.');
    process.exit(1);
  }

  const port = ports.shift();

  app.once('error', () => {
    console.log(`${port} occupied. Trying next port...`);
    tryNextPort(ports);
  });

  startServer(port);
}

tryNextPort(availablePorts);