const cron = require('node-cron');
const spaceNewsService = require("../service/space_news");
const { setCache } = require("../client/redis_client")

const updateSpaceNews = cron.schedule('*/60 * * * * *', () => {
    updateCache();
});

const updateCache = () => {
    console.log("SpaceNews cache loading");
    spaceNewsService.getArticlesTitles(5).then((articlesTitles) => {
        let jsonResponse = JSON.stringify(articlesTitles);
        setCache("space_news", jsonResponse, 60);
    })
}

updateSpaceNews.start();
updateCache();

module.exports = { updateSpaceNews }