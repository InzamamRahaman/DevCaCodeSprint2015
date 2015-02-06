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
    })

}