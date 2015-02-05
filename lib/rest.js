/**
 * Created by root on 2/5/15.
 */

modules.export = function(app, models) {

    app.post('/post/driver', function(req, res) {
        var fname = req.body.fname;
        var lname = req.body.lname;
        var nationalID = req.body.nationalID;
        var plate = req.body.plate;
        models.writeNewDriver(fname, lname, nationalID, plate);
    });

}