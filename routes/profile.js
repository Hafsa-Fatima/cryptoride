// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const mongo = require('../models/dbdriver')
ObjectID = require('mongodb').ObjectID
/*  This is the home route. It renders the index.mustache page from the views directory.
	Data is rendered using the Mustache templating engine. For more
	information, view here: https://mustache.github.io/#demo */

router.get('/driver/:id', (req, res) => {
	let data ={
		title:'Profile',
		id:req.params.id,
	}

	let p = {
		_id: ObjectID(req.params.id)
	}

	mongo.connectToServer(()=>{
		const db = mongo.getDb()
		new Promise ((resolve,reject)=>{
			db.collection('driver').find(p).toArray((err, results) => {
						if (err) reject(err)
						else resolve(results[0])
							})
		}).then((result)=>{


				var request = require('request');

				var headers = {
				    'content-type': 'text/plain;'
				};

				var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "getwalletinfo", "params": [] }';

				var options = {
				    url: 'http://127.0.0.1:'+process.env.KOMODO_PORT+'/',
				    method: 'POST',
				    headers: headers,
				    body: dataString,
				    auth: {
				        'user': process.env.KOMODO_USER,
				        'pass': process.env.KOMODO_PASSWORD,
				    }
				};

				function callback(error, response, body) {
				    if (!error && response.statusCode == 200) {
				        // res.render('profile',{data,a,result})
								let a = JSON.parse(body)
								let balance = a.result.balance + a.result.unconfirmed_balance -1999918.00
								res.render('profile',{data,balance,result})

				    }
				}

				request(options, callback);




		}).catch((err)=>{
			console.log(err)
		})

});

})

router.get('/rider/:id', (req, res) => {
	let data ={
		title:'Profile',
		id:req.params.id,
	}
	let p = {
		_id: ObjectID(req.params.id)
	}
	mongo.connectToServer(()=>{
		const db = mongo.getDb()
		new Promise((resolve,reject)=>{
			db.collection('rider').find(p).toArray((err, results) => {
			if(err) reject(err);
			else resolve(results[0])
		})
	}).then((result)=>{

		var request = require('request');

		var headers = {
				'content-type': 'text/plain;'
		};

		var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "getwalletinfo", "params": [] }';

		var options = {
				url: 'http://127.0.0.1:'+process.env.KOMODO_PORT+'/',
				method: 'POST',
				headers: headers,
				body: dataString,
				auth: {
						'user': process.env.KOMODO_USER,
						'pass': process.env.KOMODO_PASSWORD,
				}
		};

		function callback(error, response, body) {
				if (!error && response.statusCode == 200) {
						// res.render('profile',{data,a,result})
						let v = result

						let a = JSON.parse(body)
						let balance = a.result.balance + a.result.unconfirmed_balance - 1999918.00
							let p = {data,v,balance}
						// console.log(p);
						res.render('profilerider',p)
						// res.send(p)
						// res.render('profile',{data,balance,result})

				}
		}

		request(options, callback);



	}).catch((err)=>{
		console.log(err)
	})
	})
})

router.post('/',(req, res) => {

	var p= {
		email: req.body.email,
		password: req.body.passw,
	};
		mongo.connectToServer(()=>{
			const db = mongo.getDb()
			db.collection('driver').find(p).toArray((err, results) => {
						if (err) return console.log(err)
								res.send(results)
								console.log(p);
							});

	});
	// mongo.disconnectDB()
	// res.redirect('/profile')
})

router.get('/:id/getinfo',(req,res)=>{
	var request = require('request');

	var headers = {
	    'content-type': 'text/plain;'
	};

	var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "getwalletinfo", "params": [] }';

	var options = {
	    url: 'http://127.0.0.1:'+process.env.KOMODO_PORT+'/',
	    method: 'POST',
	    headers: headers,
	    body: dataString,
	    auth: {
	        'user': process.env.KOMODO_USER,
	        'pass': process.env.KOMODO_PASSWORD,
	    }
	};

	function callback(error, response, body) {
	    if (!error && response.statusCode == 200) {
	        res.send(body);
	    }
	}

	request(options, callback);
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
