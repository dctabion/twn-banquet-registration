var mongoose = require('mongoose');

// Sub Schemas
var guestSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
});

// Parent Schema
var registrantSchema = new mongoose.Scheme({
  firstName: String,
  lastName: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  guests: [ guestSchema ]
});

mongoose.model("Registrant", registrantSchema);
// mongoose.model("Guest", languageSchema);
