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
    guests: guests,
    paymentType: req.body.paymentType
  });
});

router.post('/orderConfirmed', function(req, res, next) {
  console.log('--------orderConfirmed controller');
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
  var registrant = {};
  registrant.firstName = req.body.registrantFirstName;
  registrant.lastName = req.body.registrantLastName;
  registrant.phoneNumber = req.body.phoneNumber;
  registrant.emailAddress = req.body.emailAddress;
  registrant.address1 = req.body.address1;
  registrant.address2 = req.body.address2;
  registrant.city = req.body.city;
  registrant.state = req.body.state;
  registrant.zipCode = req.body.zipCode;
  registrant.affiliation = req.body.affiliation;
  registrant.guests = guests;

  Registrant.create(registrant,
      function(err, registrant) {
        if (err) {
          console.log('error creating registrant! err: ', err);
          res.render('Error', {
            title: 'Banquet Registration Error. ',
            message: 'We had a problem processing your order.  Please try again. Sorry for the inconvenience.'
          });
        }
        else {
          console.log('created new registrant in DB!');
          res.render('orderConfirmed', {
            title: 'Order Confirmed',
            numGuests: guests.length
          });
        }
      }
    );
});





module.exports = router;
