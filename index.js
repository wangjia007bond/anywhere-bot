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
    // Let's retrieve the Facebook user whose session belongs to
    const recipientId = sessions[sessionId].fbid;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      // We return a promise to let our bot know when we're done sending
      console.log(text);
      // return fbMessage(recipientId, text)
      // .then(() => null)
      // .catch((err) => {
      //   console.error(
      //     'Oops! An error occurred while forwarding the response to',
      //     recipientId,
      //     ':',
      //     err.stack || err
      //   );
      // });
    } else {
      console.error('Oops! Couldn\'t find user for session:', sessionId);
      // Giving the wheel back to our bot
      return Promise.resolve()
    }
  },
  // You should implement your custom actions here
  // See https://wit.ai/docs/quickstart
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

	// Yay! We got a new message!
	// We retrieve the Wechat user ID of the sender
	const sender = message.FromUserName;

	// We retrieve the user's current session, or create one if it doesn't exist
	// This is needed for our bot to figure out the conversation history
	const sessionId = findOrCreateSession(sender);

	const text = message.Content;

	// We received a text message

	// Let's forward the message to the Wit.ai Bot Engine
	// This will run all actions until our bot has nothing left to do
	// wit.runActions(
	// 	sessionId, // the user's current session
	// 	text, // the user's message
	// 	sessions[sessionId].context // the user's current session state
	// ).then((context) => {
	// 	// Our bot did everything it has to do.
	// 	// Now it's waiting for further messages to proceed.
	// 	console.log('Waiting for next user messages');

	// 	// Based on the session state, you might want to reset the session.
	// 	// This depends heavily on the business logic of your bot.
	// 	// Example:
	// 	// if (context['done']) {
	// 	//   delete sessions[sessionId];
	// 	// }

	// 	// Updating the user's current session state
	// 	sessions[sessionId].context = context;
	// })
	// .catch((err) => {
	// 	console.error('Oops! Got an error from Wit: ', err.stack || err);
	// });
}));

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});