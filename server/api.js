const express = require('express');
const connect = require('connect-ensure-login');

const Event = require('./models/event');
const User = require('./models/user');

const router = express.Router();

router.get('/whoami', function(req, res) {
    if(req.isAuthenticated()) {
        User.findOne({ _id: req.user._id }, function(err, user) {
            if (err) console.log(err);
            res.send(user);
        });
    }
    else {
        res.send({});
    }
});

router.get('/events', (req, res) => {
	Event.find({}, (err, events) => {
		res.send(events);
	});
});

router.post('/new_event', (req, res) => {
	const newEvent = new Event({
		'artist': req.body.artist,
		'location': {
			'type': 'Point',
			'coordinates': req.body.location
		},
		'date': req.body.date,
		'description': req.body.description
	})

	newEvent.save((err, event) => {
		if (err) console.log(err);

		const io = req.app.get('socketio');
		io.emit('event', { artist: event.artist, location: event.location, date: event.date, description: event.description });
	});
	res.send({});
});

module.exports = router;