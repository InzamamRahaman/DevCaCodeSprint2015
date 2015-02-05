/**
 * Created by root on 2/5/15.
 */


module.exports = {
    create : function(mongoose) {
        return new MongooseModels(mongoose);
    }
}


function MongooseModels(mongoose) {

    var Schema = mongoose.Schema;
    var Model = mongoose.model;
    var RequestSchema = new Schema({
        date : {type : Date, default : Date.now},
        latitude : Number,
        longitude : Number
    });

    var PickupSchema = new Schema({

        date : {type : Date, default : Date.now},
        latitude : Number,
        longitude : Number
    });

    var DropoffSchema = new Schema({
        date : {type : Date, default : Date.now},
        latitude : Number,
        longitude : Number
    });

    var DistanceSchema = new Schema({
        date : {type : Date, default: Date.now},
        distance : Number
    });

    this.RequestModel = new Model('Request', RequestSchema);

    this.PickupModel = new Model('Pickup', PickupSchema);

    this.DropoffModel = new Model('Dropoff', DropoffSchema);

    this.DistanceModel  = new Model('Distance', DistanceSchema);

}