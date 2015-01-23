var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var listSchema = mongoose.Schema({title: String, names: [String] }, {collection: 'information'});
var ListModel = mongoose.model("ListModel", listSchema);
var issueSchema = mongoose.Schema({
      series: String,
      titles: [String],
      script: [String],
      pencils: [String],
      inks: [String],
      colours: [String],
      letters: [String],
      editing: [String],
      synopsis: [String],
      characters: [String],
      volume: String,
      number: String,
      month: String,
      year: Number},
    {collection: 'issues'});
var IssueModel = mongoose.model("IssueModel", issueSchema);
var connection = mongoose.connect('mongodb://listReader:r1o9g8u1e@ds027771.mongolab.com:27771/xcomics');

process.on('SIGINT', function() {
  mongoose.disconnect();
});

/* GET home page. */
router.get('/', function(req, res) {
  res.sendfile('views/index.html');
});

router.post('/list', function(req, res) {
  console.log(req.body);
  ListModel.find({title: req.body.listName}, function(err, doc) {
      if (err) {
          console.log(err);
      } else {
          res.send(doc);
      }
  });
});

router.post('/details', function(req, res) {
    console.log("Id: " + req.body.id);
    IssueModel.find( { _id: req.body.id }, function(err, doc) {
        if (err) {
            console.log("Error: " + err);
        } else {
            res.send(doc);
        }
    });
});

router.post('/issues', function(req, res) {
    var conditions = [];

    if (req.body.requiredCharacters.length > 0) {
        conditions.push({ characters: { $all: req.body.requiredCharacters } });
    }
    if (req.body.optionalCharacters.length > 0) {
        conditions.push({ characters: { $in: req.body.optionalCharacters } });
    }
    if (req.body.excludedCharacters.length > 0) {
        conditions.push({ characters: { $nin: req.body.excludedCharacters } });
    }

    if (req.body.optionalTitles.length > 0) {
        console.log("Optional titles: " + req.body.optionalTitles);
        conditions.push({ series: { $in: req.body.optionalTitles } });
    }
    if (req.body.excludedTitles.length > 0) {
        conditions.push({ series: { $nin: req.body.excludedTitles } });
    }

    if (req.body.optionalWriters.length > 0) {
        console.log(req.body.optionalWriters);
        conditions.push({ script: { $in: req.body.optionalWriters } });
    }
    if (req.body.excludedWriters.length > 0) {
        console.log(req.body.excludeddWriters);
        conditions.push({ script: { $nin: req.body.excludedWriters } });
    }

    if (req.body.optionalPencillers.length > 0) {
        conditions.push({ pencils: { $in: req.body.optionalPencillers } });
    }
    if (req.body.excludedPencillers.length > 0) {
        conditions.push({ pencils: { $nin: req.body.excludedPencillers } });
    }

    if (req.body.optionalInkers.length > 0) {
        conditions.push({ inks: { $in: req.body.optionalInkers } });
    }
    if (req.body.excludedInkers.length > 0) {
        conditions.push({ inks: { $nin: req.body.excludedInkers } });
    }

    conditions.push({ year: {$gte: req.body.startYear, $lte: req.body.endYear} });

    if (conditions.length > 0) {
        IssueModel.find( { $and: conditions }, { series: 1, volume: 1, number: 1, _id: 1 }, function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.send(doc);
            }
        });
    } else {
        IssueModel.find(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.send(doc);
            }
        });
    }
});

module.exports = router;
