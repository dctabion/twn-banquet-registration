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
    numGuests: guests.length,
    guests: guests,
    amountOwed: (guests.length * 40)
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

          // Build admin & developer notification
          var adminMsgBody = "";
          if (process.env.NODE_ENV != 'production') {
            adminMsgBody = adminMsgBody + "---------From local dev environment (test)-----------\n\n";
          }
          adminMsgBody = adminMsgBody + "NEW REGISTRANT\n";
          adminMsgBody = adminMsgBody + registrant.firstName + ' ' + registrant.lastName + "\n";
          adminMsgBody = adminMsgBody + registrant.phoneNumber + "\n";
          adminMsgBody = adminMsgBody + registrant.emailAddress + "\n";
          if (registrant.address1) {
            adminMsgBody = adminMsgBody + registrant.address1 + "\n";
          }
          if (registrant.address2) {
            adminMsgBody = adminMsgBody + registrant.address2 + "\n";
          }
          adminMsgBody = adminMsgBody +
                         registrant.city + ", " +
                         registrant.state + " " +
                         registrant.zipCode + "\n";

          adminMsgBody = adminMsgBody + "Affiliation: " + registrant.affiliation + "\n";
          adminMsgBody = adminMsgBody + "Payment Method: " + registrant.paymentMethod + "\n";

          adminMsgBody = adminMsgBody + "Guest List:\n";
          var count;
          for (count = 0; count < registrant.guests.length; count ++) {
            adminMsgBody = adminMsgBody + "    Seat " + (count + 1) + ": " +
                           registrant.guests[count].firstName + " " +
                           registrant.guests[count].lastName + "\n";
          }
          adminMsgBody = adminMsgBody + "Payment: " +
                         registrant.guests.length +
                         ' seats x $40 = $' + (registrant.guests.length * 40) +"\n";

          // Send message to administrator and developer
          console.log('Send message to admin and developer');
          var mailOptions = {
            from: global.myAppVars.TWN_EMAIL_BOT,
            to: global.myAppVars.TWN_EMAIL_ADMIN + ", " + global.myAppVars.TWN_EMAIL_DEVELOPER,
            subject: 'New 10/20/18 Banquet Registration',
            text: adminMsgBody
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
          html1 = html1 + '<h3>THANK YOU!</h3>';
          html1 = html1 + '<p>We are excited to present speaker, Sudanese "Lost Boy" and Episcopalian Minister, Reverand Zachariah Char. We are looking forward to seeing you at the banquet and appreciate your support of the Welcome Network!</p><br>';

          if (registrant.paymentMethod == "check") {
            html1 = html1 + '<h3>PAYMENT</h3>';
            html1 = html1 + '<p>Please make checks payable to:<i><br>Chicagoland Immigrant Welcome Network</i><br>(or feel free to use the abbreviation <i>\"CIWN\" instead</i>)<br><br>';
            html1 = html1 + 'and mail it to:<br>';
            html1 = html1 + '<i>Welcome Network Donations<br>';
            html1 = html1 + '<i>P.O. Box 3393<br>';
            html1 = html1 + '<i>Munster, IN 46321</p><br>';

          }

          html1 = html1 + '<h3>EVENT</h3>';
          html1 = html1 + '<p>10AM. Saturday, 10/20/18<br>';
          html1 = html1 + 'Gamba Ristorante<br>455 E. 84th Ave.<br>Merillville, IN 46410</p><br>';
          html1 = html1 + '<a class="flyer-anchor" href=\'https://twn-app.herokuapp.com/images/ThumbNailLostBoyFound.jpg\'><img class=\"flyer-image\" src=\"https://twn-app.herokuapp.com/images/ThumbNailLostBoyFound.jpg\" width=\"77px\" height=\"100px\" alt=\"Event Flyer\"></img></a>';
          html1 = html1 + '<p>Click for event flyer</p><br>';

          html1 = html1 + '<h3>ORDER SUMMARY</h3>';
          html1 = html1 + '<p>Amount ' +
                          ( (registrant.paymentMethod == 'check') ? 'paid' : 'owed' ) +
                          ": $" +
                          (registrant.guests.length * 40);

          html1 = html1 + '<h3>CHICAGOLAND IMMIGRANT WELCOME NETWORK</h3>';
          html1 = html1 + '<p>824 Hoffman St. | Hammond, IN 46327 | 219-276-3764</p>';
          html1 = html1 + '<a href=\"http://www.thewelcomenet.org/\"><img class=\"icon\" src=\"https://twn-app.herokuapp.com/images/TWN_logo.png\" height=\"65px\" width=\"140px\"></a>';
          html1 = html1 + '<a href=\"https://twitter.com/TheWelcomeNet\"><img class=\"icon\" src=\"https://twn-app.herokuapp.com/images/iconTwitter.png\" height=\"50px\" alt=\"Twitter\"></a>';

          html1 = html1 + '<a href=\"https://www.facebook.com/TheWelcomeNetwork\"><img class=\"icon\" src=\"https://twn-app.herokuapp.com/images/iconFacebook.png\" height=\"50px\" alt=\"FB\"></a>';
          html1 = html1 + '<style>h3 { margin-bottom: 0px } p { margin-top: 0px; margin-bottom: 0px;} .flyer-image { height: 100px; } .flyer-anchor { display: block; } i, a.anchor-block { display: block; } img.icon { height: 50px; } </style>';

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
