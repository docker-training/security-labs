const express = require('express');
const redis = require('redis');
const os = require('os');

const app = express();

var client = redis.createClient(6379, "redis");
client.on('connect', function() {
    console.log('connected to redis');
});

app.get('/',function(req,res){
    client.get('connections', function(err, value) {
        value = value || 0;
        value++;
        client.set('connections', value, function(err, reply) {
            var hostname = os.hostname();
            var message = 
                "=============" +
                "\nRedis Client:" +
                "\n=============" +
                "\nFrom Container: " + hostname + 
                "\nNumber of connections: " + value;
            res.status(200).send(message);
        });
    });
});

app.get('/health',function(req,res){
    res.status(200).send('OK');
});

app.listen(3000, '0.0.0.0');

console.log("Listening at 0.0.0.0:3000");