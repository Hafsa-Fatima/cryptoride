// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const mongo = require('../models/dbdriver')
ObjectID = require('mongodb').ObjectID
/*  This is the home route. It renders the index.mustache page from the views directory.
	Data is rendered using the Mustache templating engine. For more
	information, view here: https://mustache.github.io/#demo */

router.get('/:id', (req, res) => {
	let data ={
		title:'Your Drives',
		id:req.params.id,
	}
	let data2
	mongo.connectToServer(()=>{
		const db = mongo.getDb()
		new Promise((resolve,reject)=>{
			db.collection('driveEvent').find({driverid:req.params.id,rider:{ $exists: false}}).toArray((err, results) => {
						if (err) reject(err)
						else {
							resolve(results);
							// console.log(results);
								}
							})
						}).then((myresult)=>{
							// res.render('showDrive',{myresult,data})
							// res.send({myresult,data})
							new Promise((resolve,reject)=>{
								db.collection('driveEvent').find({$or: [{driverid:req.params.id, rider:{ $elemMatch:{
									transfer:true}}},{driverid:req.params.id, rider:{ $elemMatch:{
										transfer:false}}}]}).toArray((err, transferride) => {
										if (err) reject(err)
										else resolve(transferride)
									})}).then((transferride)=>{

										let p={myresult,data,transferride}
										res.render('showDrive',p)

									}).catch((err)=>console.log(err))


							// console.log(p)
						}
					)
					.catch((err)=>console.log(err))
		})

})

router.get('/rides/:id', (req, res) => {
	let data ={
		title:'Your Drives',
		id:req.params.id,
		name: req.query.name
	}
	mongo.connectToServer(()=>{
		const db = mongo.getDb()
		new Promise((resolve,reject)=>{
			db.collection('driveEvent').find({availableseats:{$gt:0},rider:{ $not:{$elemMatch:{r_id:req.params.id}}}}).toArray((err, results) => {
						if (err) reject(err)
						else {
							resolve(results);
							// console.log(results);
								}
							})
						}).then((myresult)=>{
								new Promise((resolve,reject)=>{
									db.collection('driveEvent').find({rider:{ $elemMatch:{r_id:req.params.id, transfer:false}}}).toArray((err, allmyride) => {
									if (err) reject(err);
									else{
										resolve(allmyride);
									}
							})
							// res.render('showDrive',{myresult,data})
							// res.send({myresult,data})
							}).then((allmyride)=>{

								if(allmyride.length != 0){
									let p={myresult,data,allmyride}
									res.render('showride',p)
									// res.send(p)
									// console.log(allmyride.rider)
								}else{
									let p={myresult,data}
									res.render('showride',p)
									// console.log(p)
								}

							}).catch((err)=>{
								console.log(err)
							})
						}
					)
					.catch((err)=>console.log(err))
		})

})

router.get('/addDrive/:id',(req, res)=>{
	const data ={
		title:'Your Drives',
		id:req.params.id,
	}
	res.render('addDrive',data)
})

router.post('/addDrive/:id',(req, res) => {
	// res.send(req.body.email);

	var request = require('request');
	var headers = {
	    'content-type': 'text/plain;'
	};

	var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "getnewaddress", "params": [] }';

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


	new Promise((resolve,reject)=>{
		request(options, (err,response, trnx)=>{
		if (!err && response.statusCode == 200) {
			 console.log(trnx);
			 console.log(trnx.result);
			 resolve(JSON.parse(trnx))
		}else{
			reject(err)
		}
	})
}).then((address) => {

		var p= req.body ;
		p = Object.assign({
			driverid: req.params.id,
			availableseats: Number(req.body.carseat),
			cost: Number(req.body.costNumber),
			transactionaddress:address.result
		},p)

		console.log(p);
		// res.send(p);
			mongo.connectToServer(()=>{
				const db = mongo.getDb()
				db.collection('driveEvent').insertOne(p,(err, results) => {
							if (err) return console.log(err)
							else {
								// res.send(results);
								console.log("inserted one item");
								// console.log(results[0]._id);
								// db.disconnectDB()
								let rediret = '/showDrives/'+req.params.id;
								res.redirect(rediret)
							}
								});

		});
}).catch((err)=>console.log(err))

	// mongo.disconnectDB()
	// res.redirect('/profile')
})

router.get('/delete/:id',(req,res)=>{
	let p = { _id: ObjectID(req.params.id)}
	mongo.connectToServer(()=>{
		const db = mongo.getDb()
		db.collection('driveEvent').deleteOne(p,(err, results) => {
			if(err) console.log(err);
			else res.redirect('/showDrives/'+req.query.driverid)
		})})

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
