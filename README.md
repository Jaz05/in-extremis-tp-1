# in-extremis-tp-1
Tp 1 del grupo In extremis de la materia Arquitectura de software

### Instalar:
npm install artillery\
npm install statsd\
npm install -g artillery-plugin-statsd\

### Instrucciones:

docker-compose up -d

### Endpoints

http://localhost:3000/ping

http://localhost:3000/space_news

http://localhost:3000/fact

http://localhost:3000/metar?station=SAEZ

### Grafana
http://localhost:8080

Importar dashboard en /perf/dashboard

### Tests

./run-scenario.sh ping\
./run-scenario.sh cache