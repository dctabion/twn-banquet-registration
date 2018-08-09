/* Express Setup */
var express = require('express');
var router = express.Router();
/* DB Setup */
var mongoose = require('mongoose');
var Registrant = mongoose.model('Registrant')

/* Email Setup */
// Nodemailer configuration
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

// login
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    xoauth2: xoauth2.createXOAuth2Generator({
      user: global.myAppVars.TWN_EMAIL_BOT_USERNAME,
      clientId: global.myAppVars.TWN_GOOGLE_CLIENT_ID,
      clientSecret: global.myAppVars.TWN_GOOGLE_CLIENT_SECRET,
      refreshToken: global.myAppVars.TWN_GOOGLE_REFRESH_TOKEN,
      accessToken: global.myAppVars.TWN_GOOGLE_ACCESS_TOKEN
    })
  }
});

// function _validateAndNormalizeReqBody() {
//
// }


/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Banquet Registration' });
});

router.post('/doRegister', function(req, res, next) {
  console.log('------doRegister()');
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
  console.log(`req.body.paymentMethod ${req.body.Method}`);

  /******* Validate & Normalize registration body ********/
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
    paymentMethod: req.body.paymentMethod,
    numGuests: req.body.numGuests,
    guests: guests
  });
});










/* Confirm Order and move on to PayPal page */
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
  console.log(`req.body.paymentMethod ${req.body.paymentMethod}`);

  /******* Validate & Normalize registration body ********/
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
  registrant.paymentMethod = req.body.paymentMethod;
  // registrant.paymentMethod = 'check';
  registrant.guests = guests;

  Registrant.create(registrant,
      function(err, registrant) {
        // Failed to add record to DB
        if (err) {
          console.log('error creating registrant! err: ', err);
          res.render('Error', {
            title: 'Banquet Registration Error. ',
            message: 'We had a problem processing your order.  Please try again. Sorry for the inconvenience.'
          });
        }
        // Successfully added record to DB
        else {
          console.log('created new registrant in DB!');
          /* Send confirmation emails */

          // Send message to administrator and developer
          console.log('Send message to admin and developer');
          var mailOptions = {
            from: global.myAppVars.TWN_EMAIL_BOT,
            to: global.myAppVars.TWN_EMAIL_ADMIN + ", " + global.myAppVars.TWN_EMAIL_DEVELOPER,
            subject: 'New 10/20/18 Banquet Registration',
            text: registrant.firstName + ' ' + registrant.lastName + ' has registered!\n'
          }
          // send mail with defined transport object
          transporter.sendMail(mailOptions, function(error, info){
            if(error){
              return console.log(error);
            }
            console.log('Email sent: ' + info.response);
          });




          // Send message to new registrant
          console.log('Send message to new registrant');
          console.log('new registrant email: ', registrant.emailAddress)

          var html1 = '<p>Hello, ' + registrant.firstName + " " + registrant.lastName + "!</p>"
          if (registrant.paymentMethod == 'online') {
            html1 = html1 + '<p>Thank you for registering for the banquet. Please mark your calender.</p>';
          }
          else if (registrant.paymentMethod == "check") {
            html1 = html1 + '<p>Thank you for registering for the banquet. ';
            html1 = html1 + 'Please make your check out to Chicagoland Immigrant Welcome Network (or feel free to use the abbreviation "CIWN") and mail the donation to:</p>';
            html1 = html1 + '<p>Welcome Network Donations<br>P.O. Box 3393<br>Munster, IN 46321</p>';
          }
          html1 = html1 + '<p>10AM. Saturday, 10/20/18<br>We look forward to seeing you there!</p>';

          html1 = html1 + '<p>Gamba Ristorante<br>455 E. 84th Ave.<br>Merillville, IN 46410<br></p>';

          html1 = html1 + '<a href=\'https://twn-app.herokuapp.com/images/LostBoyFound.pdf\'>Click for event flyer<br><br></a>'
          html1 = html1 + '<strong>CHICAGOLAND IMMIGRANT WELCOME NETOWORK</strong><br>824 Hoffman St. | Hammond, IN 46327<br>219.932.4800 (ext. 106)</p><p><a href="https://twitter.com/TheWelcomeNet">Follow</a> the Welcome Network on Twitter<br><a href="https://www.facebook.com/TheWelcomeNetwork">Like</a> the Welcome Network on Facebook</p><p><a href="http://www.thewelcomenet.org/">thewelcomenet.org</a></p>';

          var mailOptions = {
            from: "Daniel Tabion<" + global.myAppVars.TWN_EMAIL_BOT + ">",
            to: registrant.emailAddress,
            subject: 'Thank you for registering!',
            // text: 'Welcome to the Welcome Net!',
            html: html1,
            replyTo: global.myAppVars.TWN_EMAIL_ADMIN

          }
          // send mail with defined transport object
          transporter.sendMail(mailOptions, function(error, info){
            if(error){
              return console.log(error);
            }
            console.log('Email sent: ' + info.response);
          });

          /* Move on to hidden confirmation page which redirects to PayPal's page */
          res.render('orderConfirmed', {
            title: 'Order Confirmed',
            numGuests: guests.length,
            paymentMethod: registrant.paymentMethod
          });
        }
      }
    );
});





module.exports = router;
