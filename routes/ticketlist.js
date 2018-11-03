module.exports = function() {
    var route = require('express').Router();
    var conn = require('./config/db')();

    route.get('/', function(req, res) {
        res.render('ticketlist', {user:req.user});
    });


    return route;
};
