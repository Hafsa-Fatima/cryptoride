// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()

const driver = require('../models/dbdriver')
// console.log(driver)
/*  This is a sample API route. */
// router.get('/:resource', (req, res) => {
// 	res.json({
// 		confirmation: 'success',
// 		resource: req.params.resource,
// 		query: req.query // from the url query string
// 	})
// })
//
// router.get('/:resource/:id', (req, res) => {
//
// 	res.json({
// 		confirmation: 'success',
// 		resource: req.params.resource,
// 		id: req.params.id,
// 		query: req.query // from the url query string
// 	})
// })

// db.collection('driver').find().toArray((err, results) => {
// 			if (err) return console.log(err)
// 					res.send(results)


router.get('/driver', (req, res) => {
	driver.connectToServer(()=>{
		const db = driver.getDb()
		db.collection('driver').find().toArray((err, results) => {
					if (err) return console.log(err)
							res.send(results)
						})
	}
)
driver.disconnectDB()
	// db.collection('driver').find().toArray.then( driver => {
	// 	// res.json({
	// 	// 	confirmation: 'success',
	// 	// 	data: driver
	// 	// })
	// 	console.log(driver)
	// })
	// .catch(err=>{
	// 	res.json({
	// 		confirmation: 'fail',
	// 		message: err.message
	// 	})
	// })
})


module.exports = router
