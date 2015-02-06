/**
 * Created by root on 2/5/15.
 */


module.exports = {
    createSubscriptionManager : function(http, db) {
        return new SubscriptionManager(http, db);
    }
}

function SubscriptionManager(http, db) {

    // init socket io
    var io = require("socket.io")(http);

    // functions to handle the logging of data to the server

    var log_request_loc = function(long, lat) {
        db.writeNewRequest(long, lat);
    }

    var log_pickup_loc = function(long, lat) {
        db.writeNewPickup(long, lat);
    }

   var log_dropoff_loc = function(long, lat) {
        db.writeNewDropoff(long, lat);
    }

    var log_distances = function(dist) {
        db.writeNewDistance(dist);
    }


    this.start_streaming = function() {

        io.sockets.on('connection', function(socket) {
            console.log('connection established');
            socket.on("driver-start", function() {
                socket.join('drivers');
                console.log('join drivers');
            });


            socket.on("user-start", function() {
                socket.join('users');
                console.log('join users');
            });


            socket.on('traveller-request', function(request_data) {

                var request = {};
                var long = request_data.long;
                var lat = request_data.lat;
                request.user = request_data.user;
                request.long = request_data.long
                request.lat = request_data.lat;
                console.log('sending'+JSON.stringify(request));

                log_request_loc(long, lat);
                io.to('drivers').emit('customer', request);

            });

            socket.on('driver-register', function(selected_user) {

                var user_id = selected_user.user_id;
                var obj = {};
                obj.user_id = user_id;
                io.to('users').emit('registered-with-driver', obj);

            });


            socket.on('pickup', function(request_data) {


                var user_id = request_data.user_id;
                var long = request_data.long;
                var lat = request_data.lat;
                var num_seats = request_data.seats_free;
                log_pickup_loc(long, lat);
                io.to('drivers').emit('customer-pickup', request);

                if(num_seats === 0) {
                    socket.leave('drivers');
                }

            });

            socket.on('dropoff', function(request_data) {

                var user = request_data.user;
                var dropoff_lat = request_data.lat;
                var dropoff_long = request_data.long;
                var distance = request_data.distance;
                socket.join('drivers');
                log_dropoff_loc(dropoff_long, dropoff_lat);
                log_distances(distance);

            });

            socket.on('driver-broadcast', function(driver_data) {

                var lat = driver_data.lat;
                var long = driver_data.long;
                var plate = driver_data.plate
                var user = driver_data.user;
                var obj = {

                };

                obj.lat = lat;
                obj.long = long;
                obj.plate = plate;
                obj.user = user;

                io.to('users').emit('driver-info', obj);

            });

            //socket.on('driver-ready', function(driver_data) {
            //
            //});


            // user
            // request service directly
            // broadcast

            //


        });

    }


}
