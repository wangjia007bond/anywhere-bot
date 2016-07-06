'use strict';

var express = require('express');
var wechat = require('wechat');
var config = require('./config.js');

const Wit = require('node-wit').Wit;

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


// Setting up our bot
//const wit = new Wit(WIT_TOKEN, actions);

var app = express();
app.set('port', (process.env.PORT || 5000));

app.use('/wechat', wechat(config, function(req, res, next) {
	var message = req.weixin;


	if(message === '1') {
		console.log('req');
		console.log(req);		
	} else {
		console.log('res');
		console.log(res);		
	}

	// Yay! We got a new message!
	// We retrieve the Wechat user ID of the sender
	const sender = message.FromUserName;

	// We retrieve the user's current session, or create one if it doesn't exist
	// This is needed for our bot to figure out the conversation history
	const sessionId = findOrCreateSession(sender);

	const text = message.Content;

	res.reply({type: "text", content: 'success'});
}));

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});