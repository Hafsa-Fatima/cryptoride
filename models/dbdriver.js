// const mongoose = require('mongoose');
//
// var MongoC = require('mongodb').MongoClient
//
// MongoC.connect('mongodb+srv://hafsa95:asfah@hafsacluster-vencl.mongodb.net/test?retryWrites=true&w=majority', function (err, client) {
//   if (err) throw err
//
//   var db = client.db('driver')
//
//   db.collection('driver').find().toArray(function (err, result) {
//     if (err) throw err
//
//     console.log(result)
//   })
// })

var MongoClient = require( 'mongodb' ).MongoClient;
var _db;
module.exports = {
  connectToServer: function( callback ) {
    MongoClient.connect( process.env.MONGO_DBURI,{ useNewUrlParser: true }, function( err, client ) {
      _db = client.db("driver");
      return callback( err );
    } );
  },
  getDb: function() {
    return _db;
  },
  disconnectDB : () => _db.close()
};
