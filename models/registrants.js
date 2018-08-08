var mongoose = require('mongoose');

// Sub Schemas
var guestSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
});

// Parent Schema
var registrantSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  emailAddress: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  zipCode: String,
  affiliation: String,
  guests: [ guestSchema ]
});

mongoose.model("Registrant", registrantSchema);
// mongoose.model("Guest", languageSchema);
