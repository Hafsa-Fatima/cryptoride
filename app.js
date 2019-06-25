// Full Documentation - https://www.turbo360.co/docs
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})

//db config
// const config = {
// 	views: 'views', 		// Set views directory
// 	static: 'public', 		// Set static assets directory
// 	db: { 					// Database configuration. Remember to set env variables in .env file: MONGODB_URI, PROD_MONGODB_URI
// 		url: 'mongodb+srv://hafsa95:asfah@hafsacluster-vencl.mongodb.net/test?retryWrites=true&w=majority',
// 		type: 'mongo',
//     database:'driver',
// 		onError: (err) => {
// 			console.log('DB Connection Failed!')
// 		},
// 		onSuccess: (e) => {
// 			console.log('DB Successfully Connected!')
// 		}
// 	}
// }

// var MongoClient = require('mongodb').MongoClient
//
// MongoClient.connect('mongodb+srv://hafsa95:asfah@hafsacluster-vencl.mongodb.net/test?retryWrites=true&w=majority', function (err, client) {
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

const app = vertex.app() // initialize app with config options


/*
	Apps can also be initialized with config options as shown in the commented out example below. Options
	include setting views directory, static assets directory, and database settings. To see default config
	settings, view here: https://www.turbo360.co/docs

const config = {
	views: 'views', 		// Set views directory
	static: 'public', 		// Set static assets directory
	db: { 					// Database configuration. Remember to set env variables in .env file: MONGODB_URI, PROD_MONGODB_URI
		url: (process.env.TURBO_ENV == 'dev') ? process.env.MONGODB_URI : process.env.PROD_MONGODB_URI,
		type: 'mongo',
		onError: (err) => {
			console.log('DB Connection Failed!')
		},
		onSuccess: () => {
			console.log('DB Successfully Connected!')
		}
	}
}

const app = vertex.app(config) // initialize app with config options

*/


// import routes
const index = require('./routes/index')
const api = require('./routes/api')
const drive = require('./routes/drive')
const login = require('./routes/login')
const profile = require('./routes/profile')
const showDrives = require('./routes/yourDrives')

// set routes
app.use('/', index)
app.use('/drive', drive)
app.use('/login', login)
app.use('/profile', profile)
app.use('/showDrives',showDrives )
app.use('/api', api) // sample API Routes


module.exports = app
