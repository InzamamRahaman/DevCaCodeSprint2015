/**
 * Created by root on 2/5/15.
 */

module.exports = {
    init : init
}
function init(app, models) {

     var random = require("random-js");

    function generate_point(lat1, lat2, long1, long2) {

        var latp = random.real(lat1, lat2, true)(random.engine.nativeMath);
        var longp = random.real(long1, long2, true)(random.engine.nativeMath);

        var obj = {};
        obj.latitude = latp;
        obj.longitude = longp;
        return obj;

    }

    function generate_random_loc_vals(limit) {
        var arr = [];
        for(var idx = 1; idx <= limit; idx += 1) {
            arr.push(generate_point(10.682008, 10.660879, -61.530624, -61.509423));
        }
        return arr;
    }

    app.post('/post/driver', function(req, res) {
        var fname = req.body.fname;
        var lname = req.body.lname;
        var nationalID = req.body.nationalID;
        var plate = req.body.plate;
        models.writeNewDriver(fname, lname, nationalID, plate);
    });

    app.get('/index', function(req, res) {
       res.redirect('index.html');
    });

    app.get('/', function(req, res) {
        res.redirect('index.html');
    });

    app.get('/get/pickup', function(req, res) {
       models.getPickupLocations(function(err, data) {

           if(err) {
               console.log("Error " + JSON.stringify(new Error(err)));
           } else {
               res.json(data.concat(generate_random_loc_vals(100)));

           }
       });
    });

    app.get('/get/dropoff', function(req, res) {
        models.getDropoffLocations(function(err, data) {

             if(err) {
                console.log("Error " + JSON.stringify(new Error(err)));
            } else {
                res.json(data.concat(generate_random_loc_vals(100)));
            }
        });
    });
}