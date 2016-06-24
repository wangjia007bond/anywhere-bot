var express = require('express');
var wechat = require('wechat');

var app = express();

app.use('/wechat', wechat('anywherechatbot', function(req, res, next) {
	var message = req.weixin;
	console.log(message);
}));

app.listen(80);