const StatsD = require('hot-shots');

const client = new StatsD({
  host: 'graphite',
  port: 8125,
  prefix: 'hotshots.'
});

function getStartTime(){
    return process.hrtime();  
}

function registerResponseTime(startTime, metricName) {
  

  const end = process.hrtime(startTime);
  const responseTime = end[0] * 1000 + end[1] / 1000000;

  client.gauge('response_time.' + metricName, responseTime);
}

function registerMetric(metricName, value) {
  client.gauge(metricName, value);
}

module.exports = {getStartTime, registerResponseTime, registerMetric}