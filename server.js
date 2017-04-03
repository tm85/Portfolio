var StatisServer = require('static-server');

var server = new StatisServer({
    rootPath: './', 
    port: 3000

});

server.start(function() {
    console.log('Server Started on port ' + server.port);
});