const spaceNewsService = require("./service/space_news");
const uselessFactsService = require("./service/useless_facts");
const metarService = require("./service/metar");

const express = require('express');
const app = express();
const port = 3000;

app.get('/ping', (req, res) => {
  res.send('Up!')
})

app.get('/space_news', (req, res) => {  
  spaceNewsService.getArticlesTitles(5).then((articlesTitles) => {    
    res.send(JSON.stringify(articlesTitles));
  })  
})

app.get('/fact', (req, res) => {  
  uselessFactsService.getRandomFact().then((fact) => {    
    res.send(fact);
  })  
})

app.get('/metar', (req, res) => {  
  metarService.getReport(req.query.station).then((report) => {    
    console.log(report);
    res.send(JSON.stringify(report));
  })  
})


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})