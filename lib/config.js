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
    log_mongo_insert_error : log_mongo_insert_error

}
