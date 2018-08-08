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
          /* Send confirmation email */







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

          // // Send message to new registrant
          // console.log('Send message to new registrant');
          // console.log('new registrant email: ', registrant.email)
          //
          // var html1 = '<h1>Welcome, ' + results[0].firstName + "!</h1>"
          // html1 = html1 + '<p>Thank you for registering to volunteer with The Welcome Network! We are looking forward to connecting with you. We have a large and growing list of ways that individuals and churches can get involved. Let us know what strikes your interest!<\p><p>>English as a Second Language teacher (beginning fall 2017): once/twice weekly in the evenings-experience preferred but no second language is needed.</p><p>>English as a Second Language tutors: no experience/second language necessary.</p>';
          //
          // html1 = html1 + '<p>>Good Neighbors: The Welcome Network is a remote resettlement site, in partnership with USCCB, for the United States refugee resettlement program. We actively resettle victims of war and violence into Northwest Indiana. This program includes everything from picking up individuals and families at the airport, to helping them settle into their apartments, assisting with meals, language tutoring, securing employment, enrollment in school, and many other facets of life. We are looking for individuals, churches, and organizations that want to participate in this amazing opportunity.</p><p>>Administrative Volunteers: The Welcome Network is looking for an administrative assistant to schedule client interviews, mail completed case applications, database management, and keep things organized.</p><p>These are just some of our most common volunteers opportunities, most of these opportunities are flexible in schedule.</p>';
          //
          // html1 = html1 + '<p>Furthermore, we invite you to register for our monthly email newsletter:</p><a href="http://www.thewelcomenet.org/newsletter-sign-up-page">Sign Me Up!</a><p>If you have any questions or are interested in learning more about The Welcome Network, please email: <a href="mailto:info@thewelcomenet.org?Subject=Tell%20me%20more!">info@thewelcomenet.org</a></p><br><br><p>Katie Huish<br>Resettlement Coordinator<br><strong>Chicagoland Immigrant Welcome Network</strong><br>824 Hoffman St. | Hammond, IN 46327<br>219-932-4800 (ext. 106)</p><p><a href="https://twitter.com/TheWelcomeNet">Follow</a> the Welcome Network on Twitter<br><a href="https://www.facebook.com/TheWelcomeNetwork">Like</a> the Welcome Network on Facebook</p><p><a href="http://www.thewelcomenet.org/">thewelcomenet.org</a></p>';
          //
          // var mailOptions = {
          //   from: "Katie Huish<" + global.myAppVars.TWN_EMAIL_BOT + ">",
          //   to: volunteer.email,
          //   subject: 'Welcome!',
          //   // text: 'Welcome to the Welcome Net!',
          //   html: html1,
          //   replyTo: "katie@thewelcomenet.org"
          //
          // }
          // // send mail with defined transport object
          // transporter.sendMail(mailOptions, function(error, info){
          //   if(error){
          //     return console.log(error);
          //   }
          //   console.log('Email sent: ' + info.response);
          // });















          /* Move on to hidden confirmation page which redirects to PayPal's page */
          res.render('orderConfirmed', {
            title: 'Order Confirmed',
            numGuests: guests.length
          });
        }
      }
    );
});





module.exports = router;
