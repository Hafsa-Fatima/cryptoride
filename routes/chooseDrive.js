// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const mongo = require('../models/dbdriver')
ObjectID = require('mongodb').ObjectID
assert=require('assert')
var request = require('request');

/*  This is the home route. It renders the index.mustache page from the views directory.
	Data is rendered using the Mustache templating engine. For more
	information, view here: https://mustache.github.io/#demo */

router.get('/:id', (req, res) => {
	var objectId = ObjectID(req.params.id);
	let data ={
			_id :ObjectID(req.query.driverid),
	}
	let data2 ={
			_id : objectId,
			driverid: req.query.driverid,
			riderid: req.query.riderid,
			name: req.query.name
	}


	mongo.connectToServer(()=>{
		const db = mongo.getDb()
		new Promise((resolve,reject)=>{
			db.collection('driver').find(data).toArray((err, results) => {
						if (err) reject(err)
						else {
							resolve(results[0]);
							// console.log(results);
								}
							})
						}).then((myresult)=>{
							console.log(data2);
							res.render('infoDriver',{myresult,data2})
							// res.send(myresult)
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
		db.collection('driveEvent').updateOne(p,{$inc:{availableseats:1},$pull:{rider:{ r_id:req.query.riderid}}})
			res.redirect('/showDrives/rides/'+req.query.riderid)
		})

})

router.post('/confirm/:riderid',(req, res) =>{
	const opt= Math.floor(100000 + Math.random() * 900000);
	const myride=req.params.riderid
	const p ={_id: ObjectID(req.query._id)};
	mongo.connectToServer(()=>{
		const db = mongo.getDb()
		new Promise((resolve,reject)=>{
			db.collection('driveEvent',(err,collection)=>{
				collection.updateOne(p,{$set:{carliciense:req.query.carliciense},$inc:{availableseats:-req.body.seats},$push:{rider:{ name: req.query.name , address: req.body.address, r_id:req.params.riderid, seats: req.body.seats, opt:opt, transfer:false}}})
				if(err) reject(err)
				else{
					collection.find().toArray((err, myresult) =>
					resolve(myresult))
				}
			})
		}).then((myresult)=>{
			res.redirect('/showDrives/rides/'+req.params.riderid+'?name='+req.query.name)
		}).catch((err)=>console.log(err))
	})
})

router.post('/verify/:riderid',(req, res) =>{

	let p = {
		_id: ObjectID(req.query._id)
					}
	let riderid = req.params.riderid

						mongo.connectToServer(()=>{
							const db = mongo.getDb()
							new Promise((resolve,reject)=>{
								db.collection('driveEvent').find(p).toArray((err, results) => {
											if (err) reject(err)
											else {
												resolve(results[0]);
												// console.log(results);
													}
												})
											}).then((myresult)=>{
												// console.log(myresult);
												// res.send(myresult)
												let myoptarray = myresult.rider.filter((item)=>{
													return item.r_id == riderid
												})

												if(myoptarray[0].opt== Number(req.body.optnumber))
												{
													var headers = {
																				    'content-type': 'text/plain;'
																				};
													var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "sendtoaddress", "params": ["'+myresult.transactionaddress+'",'+myresult.cost+', "donation", "seans outpost"] }';

													var options = {
																				    url: 'http://127.0.0.1:9032/',
																				    method: 'POST',
																				    headers: headers,
																				    body: dataString,
																				    auth: {
																				        'user': 'user2863247190',
																				        'pass': 'passcd362862e2d5d2d752a123857dbba0474cd48a55af419c022b1f59a2c21aecab5a'
																				    }
																				};

													function callback(error, response, body) {
															    if (!error && response.statusCode == 200) {
																				        console.log(body);
																				    }
																				}

													request(options, callback);

													db.collection('driveEvent').updateOne(p,
														{$set:{"rider.$[elem].transfer": true}},
														{
															multi : true,
															arrayFilters:[{ "elem.r_id" : riderid}]
														})
														res.redirect('/showDrives/rides/'+riderid)
											}else{
												res.send("wrong opt")
											}
												// res.render('infoDriver',{myresult,data2})
											}
										)
										.catch((err)=>console.log(err))
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
