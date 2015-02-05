/**
 * Created by root on 2/5/15.
 */


module.exports = {
    create : function(mongoose) {
        return new MongooseModels(mongoose);
    }
}


var config = require("./config");


function MongooseModels(mongoose) {

    var that = this;

    //var Schema = mongoose.Schema;
    //var Model = mongoose.model;
    var RequestSchema = new mongoose.Schema({
        date : {type : Date, default : Date.now},
        latitude : Number,
        longitude : Number
    });

    var PickupSchema = new mongoose.Schema({

        date : {type : Date, default : Date.now},
        latitude : Number,
        longitude : Number
    });

    var DropoffSchema = mongoose.Schema({
        date : {type : Date, default : Date.now},
        latitude : Number,
        longitude : Number
    });

    var DistanceSchema = mongoose.Schema({
        date : {type : Date, default: Date.now},
        distance : Number
    });

    var DriverSchema = mongoose.Schema({

        firstName : String,
        lastName : String,
        nationalID : String,
        plate : String
    });

    this.Request =  mongoose.model('Request', RequestSchema);

    this.Pickup = mongoose.model('Pickup', PickupSchema);

    this.Dropoff = mongoose.model('Dropoff', DropoffSchema);

    this.Distance  = mongoose.model('Distance', DistanceSchema);

    this.Driver = mongoose.model('User', DriverSchema);

    this.writeNewRequest = function(long, lat) {

        var req = new that.Request({'long' : long, 'lat' : lat});
        req.save(config.log_mongo_insert_error)

    }

    this.writeNewDriver = function(firstName, lastName, nationalID, plate) {
        var user = new that.Driver({
            'firstName' : firstName,
            'lastName'  : lastName,
            'nationalID': nationalID,
            'plate'     : plate
        });
        user.save(config.log_mongo_insert_error);
    }

    this.writeNewPickup = function(long, lat) {
        var req = new that.Pickup({'long' : long, 'lat' : lat});
        req.save(config.log_mongo_insert_error)
    }

    this.writeNewDropoff = function(long, lat) {
        var req = new that.Dropoff({'long' : long, 'lat' : lat});
        req.save(config.log_mongo_insert_error)

    }

    this.writeNewDistance = function (dist) {
        var req = new that.Distance({'distance' : dist});
        req.save(config.log_mongo_insert_error)
    }

}