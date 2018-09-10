module.exports = function() {
  var route = require('express').Router();
  route.get('/', function(req, res) {
    res.render('ticketcontent', {user:req.user});
  });
  return route;
};
