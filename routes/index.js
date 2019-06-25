// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()

/*  This is the home route. It renders the index.mustache page from the views directory.
	Data is rendered using the Mustache templating engine. For more
	information, view here: https://mustache.github.io/#demo */
router.get('/', (req, res) => {
	const data ={
		title:'SignUp'
	}
	res.render('index',data)
})



router.get('/ride', (req, res) => {
	const data ={
		title:'SignUp As Rider'
	}
	res.render('signupride',data)
})

// router.get('/profile', (req, res) => {
// 	const data ={
// 		title:'SignUp As Rider'
// 	}
// 	res.render('profile',data)
// })

router.get('/maprouter', (req, res) => {
	const data ={
		title:'SignUp As Rider'
	}
	res.render('maprouter',data)
})

// router.get('/addDrive', (req, res) => {
// 	const data ={
// 		title:'SignUp As Rider'
// 	}
// 	res.render('adddrive',data)
// })
//
// router.get('/showdrive', (req, res) => {
// 	const data ={
// 		title:'SignUp As Rider'
// 	}
// 	res.render('showdrives',data)
// })

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
