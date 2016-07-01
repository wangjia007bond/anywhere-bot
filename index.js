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
	send({sessionId}, {text}) {
		// Our bot has something to say!
		// Let's retrieve the Wechat user whose session belongs to
		const recipientId = sessions[sessionId].wcid;
		if (recipientId) {
			// Yay, we found our recipient!
			// Let's forward our bot response to her.
			// We return a promise to let our bot know when we're done sending
			return wcMessage(recipientId, text)
				.then(() => null)
				.catch((err) => {
					console.error(
						'Oops! An error occurred while forwarding the response to',
						recipientId,
						':',
						err.stack || err
					);
				});
		} else {
			console.error('Oops! Couldn\'t find user for session:', sessionId);
			// Giving the wheel back to our bot
			return Promise.resolve()
		}
	},
	// You should implement your custom actions here
	// See https://wit.ai/docs/quickstart
};

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