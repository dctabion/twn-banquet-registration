var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Registrant = mongoose.model('Registrant')

/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Banquet Registration' });
});

router.post('/doRegister', function(req, res, next) {
  console.log(`req.body.registrantFirstName ${req.body.registrantFirstName}`);
  console.log(`req.body.registrantLastName ${req.body.registrantLastName}`);
  console.log(`req.body.phoneNumber ${req.body.phoneNumber}`);
  console.log(`req.body.emailAddress ${req.body.emailAddress}`);
  console.log(`req.body.address1 ${req.body.address1}`);
  console.log(`req.body.address2 ${req.body.address2}`);
  console.log(`req.body.city ${req.body.city}`);
  console.log(`req.body.state ${req.body.state}`);
  console.log(`req.body.zipCode ${req.body.zipCode}`);
  console.log(`req.body.affiliation ${req.body.affiliation}`);

  /******* TODO: validate & normalize registration body ********/
  // move guest entries to array
  var guests = [];
  var i;
  var tmpFirstName, tmpLastName;

  console.log('req.body:', req.body);
  for (i=1; i<11; i++) {
    tmpFirstName = eval(`req.body.guest_fname_${i}`);
    tmpLastName = eval(`req.body.guest_lname_${i}`);
    if ( tmpFirstName && tmpLastName ) {
      console.log(`${i} valid guest name: ${tmpFirstName} ${tmpLastName}`)
      guests.push({
        firstName: tmpFirstName,
        lastName: tmpLastName
      });
    }
    else {
      console.log(`${i} invalid guest name: ${tmpFirstName} ${tmpLastName}`);
    }
  }
  console.log('guests', guests);

  // TODO: check for injections and security breach


  // TODO: store registration body in DB
  res.render('confirmOrder', {
    title: 'Confirm Order',
    registrantFirstName: req.body.registrantFirstName,
    registrantLastName: req.body.registrantLastName,
    phoneNumber: req.body.phoneNumber,
    emailAddress: req.body.emailAddress,
    address1: req.body.address1,
    address2: req.body.address2,
    city: req.body.city,
    state: req.body.state,
    zipCode: req.body.zipCode,
    affiliation: req.body.affiliation,
    numGuests: req.body.numGuests,
    guests: guests
  });
});

router.post('/orderConfirmedHiddenPage', function(req, res, next) {
  console.log('--------orderConfirmedHiddenPage controller');
  console.log(`req.body.registrantFirstName ${req.body.registrantFirstName}`);
  console.log(`req.body.registrantLastName ${req.body.registrantLastName}`);
  console.log(`req.body.phoneNumber ${req.body.phoneNumber}`);
  console.log(`req.body.emailAddress ${req.body.emailAddress}`);
  console.log(`req.body.address1 ${req.body.address1}`);
  console.log(`req.body.address2 ${req.body.address2}`);
  console.log(`req.body.city ${req.body.city}`);
  console.log(`req.body.state ${req.body.state}`);
  console.log(`req.body.zipCode ${req.body.zipCode}`);
  console.log(`req.body.affiliation ${req.body.affiliation}`);

  /******* TODO: validate & normalize registration body ********/
  // move guest entries to array
  var guests = [];
  var i;
  var tmpFirstName, tmpLastName;

  for (i=1; i<11; i++) {
    tmpFirstName = eval(`req.body.guest_fname_${i}`);
    tmpLastName = eval(`req.body.guest_lname_${i}`);
    if ( tmpFirstName && tmpLastName ) {
      console.log(`${i} valid guest name: ${tmpFirstName} ${tmpLastName}`)
      guests.push({
        firstName: tmpFirstName,
        lastName: tmpLastName
      });
    }
    else {
      console.log(`${i} invalid guest name: ${tmpFirstName} ${tmpLastName}`);
    }
  }
  console.log('guests', guests);
  
  /************* SAVE TO DATABASE **********/
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

  res.render('orderConfirmedHiddenPage', {
    title: 'Order Confirmed Hidden Page',
    numGuests: guests.length
  });
});





module.exports = router;
