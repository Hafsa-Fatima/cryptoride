// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const mongo = require('../models/dbdriver')
ObjectID = require('mongodb').ObjectID
assert=require('assert')

/*  This is the home route. It renders the index.mustache page from the views directory.
	Data is rendered using the Mustache templating engine. For more
	information, view here: https://mustache.github.io/#demo */

router.get('/:id', (req, res) => {
	var objectId = ObjectID(req.params.id);
	let data ={
			_id : objectId,
			driverid: req.query.driverid,
	}
	let data2 ={
			_id : objectId,
			driverid: req.query.driverid,
			riderid: req.query.riderid
	}


	mongo.connectToServer(()=>{
		const db = mongo.getDb()
		new Promise((resolve,reject)=>{
			db.collection('driveEvent').find(data).toArray((err, results) => {
						if (err) reject(err)
						else {
							resolve(results);
							// console.log(results);
								}
							})
						}).then((myresult)=>{
							console.log(data2);
							res.render('infoDriver',{myresult,data2})
						}
					)
					.catch((err)=>console.log(err))
		})

})

router.get('/delete/:id', (req, res) => {
	var objectId = ObjectID(req.params.id);
	let data ={
			_id : objectId,
			driverid: req.query.driverid,
	}
	let data2 ={
			_id : objectId,
			driverid: req.query.driverid,
			riderid: req.query.riderid
	}
	const p ={_id: objectId}

	mongo.connectToServer(()=>{
		const db = mongo.getDb()
		db.collection('driveEvent').updateOne(p,{$inc:{availableseats:4},$pull:{rider:{ r_id:req.query.riderid}}})
			res.redirect('/showDrives/rides/'+req.query.riderid)
		})

})

router.post('/confirm/:riderid',(req, res) =>{
	const opt= new ObjectID();
	const myride=req.params.riderid
	const p ={_id: ObjectID(req.query._id)};
	mongo.connectToServer(()=>{
		const db = mongo.getDb()
		new Promise((resolve,reject)=>{
			db.collection('driveEvent',(err,collection)=>{
				collection.updateOne(p,{$inc:{availableseats:-req.body.seats},$push:{rider:{ r_id:req.params.riderid, seats: req.body.seats, opt:opt}}})
				if(err) reject(err)
				else{
					collection.find().toArray((err, myresult) =>
					resolve(myresult))
				}
			})
		}).then((myresult)=>{
			res.redirect('/showDrives/rides/'+req.params.riderid)
		}).catch((err)=>console.log(err))
	})
})

// /*  This route render json data */
// router.get('/json', (req, res) => {
// 	res.json({
// 		confirmation: 'success',
// 		app: process.env.TURBO_APP_ID,
// 		data: 'this is a sample json route.'
// 	})
// })
//
// /*  This route sends text back as plain text. */
// router.get('/send', (req, res) => {
// 	res.send('This is the Send Route')
// })
//
// /*  This route redirects requests to Turbo360. */
// router.get('/redirect', (req, res) => {
// 	res.redirect('https://www.turbo360.co/landing')
// })


module.exports = router
