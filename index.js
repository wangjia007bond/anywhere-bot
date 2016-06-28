var express = require('express');
var wechat = require('wechat');
var config = require('./config.js');
var Wit = require('node-wit').Wit;

var WIT_TOKEN = conifg.wit-token;

// Wit.ai bot specific code

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {wcid: weChatUserId, context: sessionState}
var sessions = {};

var findOrCreateSession = function(wcid) {
	var sessionId;
	// Let's see if we already have a session for the user wcid
	Object.keys(sessions).forEach(function(k) {
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
var actions = {
	say(sessionId, context, message, cb) {
		// Our bot has something to say!
		// Let's retrieve the Wechat user whose session belongs to
		var recipientId = sessions[sessionId].wcid;
		if (recipientId) {
			// Yay, we found our recipient!
			// Let's forward our bot response to her.
			wcMessage(recipientId, message, function(err, data) {
				if (err) {
					console.log(
					'Oops! An error occurred while forwarding the response to',
					recipientId,
					':',
					err
					);
				}

				// Let's give the wheel back to our bot
	        	cb();
			});
    	} else {
      		console.log('Oops! Couldn\'t find user for session:', sessionId);
      		// Giving the wheel back to our bot
      		cb();
    	}
	},
	merge(sessionId, context, entities, message, cb) {
		cb(context);
	},
	error(sessionId, context, error) {
		console.log(error.message);
	},
	// You should implement your custom actions here
	// See https://wit.ai/docs/quickstart
};

// Setting up our bot
var wit = new Wit(WIT_TOKEN, actions);


var app = express();
app.set('port', (process.env.PORT || 5000));

app.use('/wechat', wechat(config, function(req, res, next) {
	var message = req.weixin;

	console.log(message);
	res.reply({type: "text", content: 'Hello world!'});

    // Yay! We got a new message!

    // We retrieve the Facebook user ID of the sender
    const sender = messaging.sender.id;

    // We retrieve the user's current session, or create one if it doesn't exist
    // This is needed for our bot to figure out the conversation history
    const sessionId = findOrCreateSession(sender);

	// We received a text message

	// Let's forward the message to the Wit.ai Bot Engine
	// This will run all actions until our bot has nothing left to do
	wit.runActions(
	sessionId, // the user's current session
	message, // the user's message 
	sessions[sessionId].context, // the user's current session state
	function(error, context) {
	  if (error) {
	    console.log('Oops! Got an error from Wit:', error);
	  } else {
	    // Our bot did everything it has to do.
	    // Now it's waiting for further messages to proceed.
	    console.log('Waiting for futher messages.');

	    // Based on the session state, you might want to reset the session.
	    // This depends heavily on the business logic of your bot.
	    // Example:
	    // if (context['done']) {
	    //   delete sessions[sessionId];
	    // }

	    // Updating the user's current session state
	    sessions[sessionId].context = context;
	  }
	}
	);
}));

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});