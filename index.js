'use strict';

var express = require('express');
var wechat = require('wechat');
var config = require('./config.js');

let Wit = require('node-wit').Wit;
let log = require('node-wit').log;

// Wit.ai parameters
const WIT_TOKEN = process.env.WIT_TOKEN || 'XWQB622ZWQXIYPBKISLSIKFDYHFQ7G23';

var app = express();
app.set('port', (process.env.PORT || 5000));

app.use('/wechat', wechat(config, function(req, res, next) {
	var message = req.weixin;

	console.log(message);
	console.log(WIT_TOKEN);
	console.log(message.Content);
	res.reply({type: "text", content: 'Hello world!'});
}));

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});