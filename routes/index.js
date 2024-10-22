var express = require('express');
var router = express.Router();

require('../models/connection');
const Place = require('../models/places');
const { checkBody } = require('../modules/checkBody');

router.post('/places', (req, res) => {
  if (!checkBody(req.body, ['nickname', 'name', 'latitude', 'longitude'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const { nickname, name, latitude, longitude } = req.body;
  const newPlace = new Place({ nickname, name, latitude, longitude });

  newPlace.save().then(() => {
    res.json({ result: true });
  });
});

router.get('/places/:nickname', (req, res) => {
  // Regex to find places regardless of nickname case
  Place.find({ nickname: { $regex: new RegExp(req.params.nickname, 'i') } }).then(data => {
      res.json({ result: true, places: data });
  });
});

router.delete('/places', (req, res) => {
  if (!checkBody(req.body, ['nickname', 'name'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const { nickname, name } = req.body;

  // Regex to delete place regardless of nickname case
  Place.deleteOne({ nickname: { $regex: new RegExp(nickname, 'i') }, name }).then((deletedDoc) => {
    if (deletedDoc.deletedCount > 0) {
      res.json({ result: true });
    } else {
      res.json({ result: false, error: 'Place not found' });
    }
  });
});

module.exports = router;
