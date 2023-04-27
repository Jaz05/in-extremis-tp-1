const spaceNewsService = require("./service/space_news");
const uselessFactsService = require("./service/useless_facts");
const metarService = require("./service/metar");
const express = require('express');
const app = express();
const port = 3000;
const { getCache, setCache } = require("./client/redis_client")

app.get('/ping', (req, res) => {
  res.send('Up!')
})

app.get('/space_news', (req, res) => {
  spaceNewsService.getArticlesTitles(5).then((articlesTitles) => {
    res.send(JSON.stringify(articlesTitles));
  })
})

app.get('/space_news_cache', async (req, res) => {
  let cacheKey = "space_news";
  let foundCache = await getCache(cacheKey)
  if (foundCache != null) {
    await res.send(foundCache);
  } else {
    spaceNewsService.getArticlesTitles(5).then((articlesTitles) => {
      let jsonResponse = JSON.stringify(articlesTitles);
      setCache(cacheKey, jsonResponse);
      res.send(jsonResponse);
    })
  }
})

app.get('/fact', (req, res) => {
  uselessFactsService.getRandomFact().then((fact) => {
    res.send(fact);
  })
})

app.get('/metar', (req, res) => {
  metarService.getReport(req.query.station).then((report) => {
    res.send(JSON.stringify(report));
  })
})

app.get('/metar_cache', async (req, res) => {
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
})



app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})