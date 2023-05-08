const spaceNewsService = require("./service/space_news");
const uselessFactsService = require("./service/useless_facts");
const metarService = require("./service/metar");
const express = require('express');
const app = express();
const port = 3000;
const { getCache, setCache } = require("./client/redis_client")
const {getStartTime,registerResponseTime}  = require("./metric/hotshot_metric")

app.get('/ping', (req, res) => {
  let startTime = getStartTime();
  res.send('Up!')
  registerResponseTime(startTime, "endpoint.ping");
})

app.get('/space_news', (req, res) => {
  let startTime = getStartTime();
  spaceNewsService.getArticlesTitles(5).then((articlesTitles) => {    
    res.send(JSON.stringify(articlesTitles));
  })
  registerResponseTime(startTime, "endpoint.spacenews");
})

app.get('/space_news_cache', async (req, res) => {
  let startTime = getStartTime();
  let cacheKey = "space_news";
  let foundCache = await getCache(cacheKey)
  if (foundCache != null) {
    res.send(foundCache);
  } else {
    spaceNewsService.getArticlesTitles(5).then((articlesTitles) => {
      let jsonResponse = JSON.stringify(articlesTitles);
      setCache(cacheKey, jsonResponse);
      res.send(jsonResponse);
    })
  }
  registerResponseTime(startTime, "endpoint.spacenews");
})

app.get('/fact', (req, res) => {
  let startTime = getStartTime();
  uselessFactsService.getRandomFact().then((fact) => {
    res.send(fact);
  })
  registerResponseTime(startTime, "endpoint.uselessfacts");
})

app.get('/metar', (req, res) => {
  let startTime = getStartTime();
  metarService.getReport(req.query.station).then((report) => {
    res.send(JSON.stringify(report));
  })
  registerResponseTime(startTime, "endpoint.metar");
})

app.get('/metar_cache', async (req, res) => {
  let startTime = getStartTime();
  let cacheKey = "metar_" + req.query.station;
  let foundCache = await getCache(cacheKey)
  if (foundCache != null) {    
    res.send(foundCache);
  } else {
    metarService.getReport(req.query.station).then((report) => {
      let jsonResponse = JSON.stringify(report);
      setCache(cacheKey, jsonResponse);
      res.send(jsonResponse);
    })
  }
  registerResponseTime(startTime, "endpoint.metar");  
})



app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})