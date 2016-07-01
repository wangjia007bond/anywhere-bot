'use strict';

var express = require('express');
var wechat = require('wechat');
var config = require('./config.js');
var Wit = require('node-wit').Wit;

let Wit = require('node-wit').Wit;
let log = require('node-wit').log;


var app = express();
app.set('port', (process.env.PORT || 5000));

app.use('/wechat', wechat(config, function(req, res, next) {
	var message = req.weixin;

	console.log(res);
	console.log(req);
	console.log(message);
	res.reply({type: "text", content: 'Hello world!'});
}));

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});