var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Registrant = mongoose.model('Registrant')

/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Banquet Registration' });
});

router.get('/doRegister', function(req, res, next) {
  res.render('registerComplete', { title: 'Received Registration Request' });

  // var registrant = {};
  // registrant.firstName = "Dood";
  // registrant.lastName = "McGee";
  // registrant.address = "123 Sesame St.";
  // registrant.city = "New York";
  // registrant.state = "Indiana";
  // registrant.guests = [
  //   { firstname: "Travis", lastName: "McGee"},
  //   { firstname: "Mike", lastName: "McGee"}
  // ];
  //
  //
  // Registrant.create(registrant,
  //     function(err, registrant) {
  //       if (err) {
  //         console.log('error creating registrant! err: ', err);
  //         res.render('register', { title: 'Banquet Registration with error' });
  //       }
  //       else {
  //         console.log('created new registrant!');
  //         res.render('register', { title: 'Banquet Registration' });
  //       }
  //     }
  //   );

  // res.render('register', { title: 'Banquet Registration' });

});

module.exports = router;
