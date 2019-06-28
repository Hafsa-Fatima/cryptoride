// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const mongo = require('../models/dbdriver')

/*  This is the home route. It renders the index.mustache page from the views directory.
	Data is rendered using the Mustache templating engine. For more
	information, view here: https://mustache.github.io/#demo */

router.get('/', (req, res) => {
	const data ={
		title:'SignUp As Driver'
	}
	res.render('signupdrive',data)
})

router.post('/',(req, res) => {
	// res.send(req.body.email);
	var p= {
		name:req.body.dname,
		email: req.body.email,
		password: req.body.passw,
		carliciense: req.body.carnumber
	};
		mongo.connectToServer(()=>{
			const db = mongo.getDb()
			db.collection('driver').insertOne(p,(err, results) => {
						if (err) return console.log(err)
								console.log("inserted one item");
								res.redirect('/login')
								// mongo.disconnectDB()
							});

	});

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
