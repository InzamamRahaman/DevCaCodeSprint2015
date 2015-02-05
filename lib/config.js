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


module.exports = {

    port : port,
    init : init_app
}
