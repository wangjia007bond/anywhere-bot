var express = require('express');
var wechat = require('wechat');
var config = require('./config.js');

var app = express();

app.use('/', wechat(config, function(req, res, next) {
	var message = req.weixin;
	console.log(message);
}));

app.listen(80);