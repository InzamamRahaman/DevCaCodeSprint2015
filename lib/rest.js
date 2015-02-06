/**
 * Created by root on 2/5/15.
 */

module.exports = {
    init : init
}
function init(app, models) {

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
               res.json(data);
           }
       });
    });

    app.get('/get/dropoff', function(req, res) {
        models.getDropoffLocations(function(err, data) {

            if(err) {
                console.log("Error " + JSON.stringify(new Error(err)));
            } else {
                res.json(data);
            }
        });
    });
}