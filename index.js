'use strict';

var express = require('express');
var wechat = require('wechat');
var config = require('./config.js');

let Wit = require('node-wit').Wit;
let log = require('node-wit').log;

// Wit.ai parameters
const WIT_TOKEN = process.env.WIT_TOKEN || 'XWQB622ZWQXIYPBKISLSIKFDYHFQ7G23';

// ----------------------------------------------------------------------------
// Wit.ai bot specific code

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {wcid: wechatUserId, context: sessionState}
const sessions = {};

const findOrCreateSession = (wcid) => {
	let sessionId;
	// Let's see if we already have a session for the user wcid
	Object.keys(sessions).forEach(k => {
		if (sessions[k].wcid === wcid) {
			// Yep, got it!
			sessionId = k;
		}
	});
	if (!sessionId) {
		// No session found for user wcid, let's create a new one
		sessionId = new Date().toISOString();
		sessions[sessionId] = {wcid: wcid, context: {}};
	}
	return sessionId;
};

// Our bot actions
const actions = {
	send(request, response) {
		// const {sessionId, context, entities} = request;
		// const {text, quickreplies} = response;
		return new Promise(function(resolve, reject) {
			console.log('user said...', request.text);
			console.log('sending...', JSON.stringify(response));
			return resolve();
		});
	},
};

// Setting up our bot
// const wit = new Wit({
// 	accessToken: WIT_TOKEN,
// 	actions,
// 	logger: new log.Logger(log.INFO)
// });


var app = express();
app.set('port', (process.env.PORT || 5000));

app.use('/wechat', wechat(config, function(req, res, next) {
	var message = req.weixin;

	console.log('message:' + message.toString());
	console.log('WIT_TOKEN:' + WIT_TOKEN);
	console.log(message.Content);
	res.reply({type: "text", content: 'Hello world!'});
}));

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});