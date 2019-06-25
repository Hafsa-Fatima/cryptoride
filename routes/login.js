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
		title:'Login'
	}
	res.render('login',data)
})

router.post('/',(req, res) => {
	// res.send(req.body.email);
	var p= {
		email: req.body.email,
		password: req.body.passw,
	};
		mongo.connectToServer(()=>{
			const db = mongo.getDb()
			db.collection('driver').find(p).toArray((err, results) => {
						if (err) return console.log(err)
						else {
							// res.send(results);
							// console.log(results[0]._id);
							// db.disconnectDB()
							let rediret = '/profile/'+results[0]._id;
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
