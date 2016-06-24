var express = require('express');
var wechat = require('wechat');
var config = require('./config.js');

var app = express();
app.set('port', (80 || process.env.PORT));

app.use('/wechat', wechat(config, function(req, res, next) {
	var message = req.weixin;
	console.log(message);
}));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});