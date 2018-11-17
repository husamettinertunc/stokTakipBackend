const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//modeller
const User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', (req, res) => {

	console.log(req.body);
  const { username, password } = req.body;
	User.findOne({
		username
	}, (err, user) => {
		if (err)
			throw err;

		if(!user){
			res.json({
				status: false,
				message: 'Kullanıcı Bulunamadı..'
			});
    }else{
			bcrypt.compare(password, user.password).then((result) => {
				if (!result){
					res.json({
						status: false,
						message: 'Şifreniz hatalı!'
					});
				}else{
					const payload = {
						username
          };          
					const token = jwt.sign(payload, req.app.get('api_secret_key'), {
            expiresIn: 720 // 12 saat
					});
          console.log(token);
					res.json({
						status: true,
						token
					})
				}
			});
    }
	});

});

router.post('/newusers', function(req, res, next) {
  const { username, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      username,
      password: hash
    });

    const promise = user.save();
    promise.then((data) => {
      res.json(data);
    }).catch((err) => {
      res.json(err);
    });
});


});

module.exports = router;
