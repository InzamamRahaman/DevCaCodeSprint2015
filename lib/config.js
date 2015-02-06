/**
 * Created by root on 2/5/15.
 */

// functions to export

var port = 3000;
var bodyParser = require("body-parser");


function init_app(app) {

    app.use(bodyParser.urlencoded({
        extended : false
    }));
    app.use(bodyParser.json());

    return app;

}

function log_mongo_insert_error(err) {
    if(err) {
        console.log("Error occurred " + JSON.stringify(new Error(err)));
    } else {
        console.log("Saved");
    }
}




module.exports = {

    port : port,
    init : init_app,
    log_mongo_insert_error : log_mongo_insert_error,
    local_mongo_uri : 'mongodb://localhost/test',
    heroku_mongo_uri : 'http://ds053648.mongolab.com:53648/heroku_app31154649',
    get_mongo_uri : function() {
        var args = process.args;
        if(args.length > 2) {
            return   process.env.MONGOLAB_URI;
        } else {
            return this.local_mongo_uri;
        }
    }

}
