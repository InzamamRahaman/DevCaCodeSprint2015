//var express = require('express');
//var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
//
//var routes = require('./routes/index');
//var users = require('./routes/users');
//
//var app = express();
//
//// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//
//// uncomment after placing your favicon in /public
////app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
//
//app.use('/', routes);
//app.use('/users', users);
//
//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});
//
//// error handlers
//
//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function(err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});
//
//
//module.exports = app;

var fs = require("fs");
var express = require("express");
var path = require("path");
var config = require("./lib/config");
var mongoose = require("mongoose");
var mongooseAPI = require("mongoose-api");
var app = config.init(express());

var http = require("http").Server(app);
//mongooseAPI.serveModels(app);
var db = mongoose.connection;
var static_loc = (path.join(__dirname, 'app'));


app.use(express.static(static_loc));
//var mongooseModel = require("./lib/mongo-models").create(undefined);

var mongoModels = require("./lib/mongo-models").create(mongoose);

var subs = require("./lib/subscription-manager").createSubscriptionManager(http, mongoModels);

mongoose.connect(config.get_mongo_uri());
var rest = require("./lib/rest")
rest.init(app, mongoModels);
mongoose.connection.on('error', console.error.bind(console, "console.log"));

var _ = require("lodash");


function create_json_representation(data) {

    //console.log(data);
    var len = data[0].length;
    var v1 = _.map(data, function(row) {
       return {
           'temp' : row[len - 3],
           'lat' : row[len - 2],
           'long' : row[len - 1]
       }
    });


    var v2 = _.filter(v1, function(row) {
        var lat = row['lat'];
        var long = row['long'];
        if(lat == undefined || lat == null || lat == '') {
            return false;
        } else if(long == undefined || long == null || long == '') {
            return false;
        } else {
            return true;
        }
    });

    //console.log(v2);

    var groupings = _.groupBy(v2, function(row) {
       return [row['lat'], row['long']];
    });

    //console.log(groupings);

    return _.map(groupings, function(group) {
        //console.log("grp "  + JSON.stringify(group));
        var vals = _.map(group, function(g) {
            return parseInt(g['temp']);
        });
        var sum = _.reduce(vals, function(a, b) {return a + b}, 0);
        return {

            'lat' : parseFloat(group[0]['lat']),
            'long' : parseFloat(group[0]['long']),
            'heat' : sum
        };
    });

}


mongoose.connection.once('open', function() {

    http.listen(config.port, function(){
        console.log(static_loc);
        console.log("Listening on http://127.0.0.1:"+config.port);
        subs.start_streaming();
        var loc = __dirname + "/csv/accidents.csv"

        var stream = fs.createReadStream(loc);
        var csv = require("fast-csv");
        var d = [];
        var csvStream = csv()
            .on('data', function(data) {
                d.push(data);
            })
            .on('end', function() {
                d.shift();
                var csv_data = create_json_representation(d);
                app.get('/get/accidents', function(req, res) {
                   res.json(csv_data);
                });
            });
        stream.pipe(csvStream);
    });

});
