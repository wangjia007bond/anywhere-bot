var express = require('express');
var wechat = require('wechat');
var crypto = require('crypto');
var config = require('./config.js');

var app = express();

app.set('port', (433 || process.env.PORT));

var checkSignature = function(query, token) {
    var signature = query.signature;
    var timestamp = query.timestamp;
    var nonce = query.nonce;

    var shasum = crypto.createHash('sha1');
    var arr = [token, timestamp, nonce].sort();
    shasum.update(arr.join(''));

    return shasum.digest('hex') === signature;
};

app.get('/', function(req, res) {
    if (checkSignature(req.query, config.token)) {
        res.send(req.query.echostr);
    } else {
        res.send('error');
    }
});

app.use('/wechat', wechat(config, function(req, res, next) {
	var message = req.weixin;
	console.log(message);
}));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});