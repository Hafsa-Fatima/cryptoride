// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const mongo = require('../models/dbdriver')

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
			db.collection('driveEvent').find().toArray((err, results) => {
						if (err) reject(err)
						else {
							resolve(results);
							// console.log(results);
								}
							})
						}).then((myresult)=>{
							// res.render('showDrive',{myresult,data})
							// res.send({myresult,data})
							let p={myresult,data}
							res.render('showDrive',p)
							console.log(p)
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
	var p= req.body ;
	p = Object.assign({
		driverid: req.params.id
	},p)
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
	// mongo.disconnectDB()
	// res.redirect('/profile')
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
