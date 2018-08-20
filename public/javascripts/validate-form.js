function validateForm() {
  console.log('validateForm()');

  /* ------- Validate Phone Number ------ */
  var phoneNumberEl = document.getElementById('phoneNumber');
  var phoneNumber = phoneNumberEl.value;
  console.log(`phoneNumber: ${phoneNumber}`);
  var phoneNumberDigitsOnly = phoneNumber.replace(/\D/g,'');
  console.log(`phoneNumberDigitsOnly: ${phoneNumberDigitsOnly}`);
  // Not right number of digits
  phoneNumberEl.value = phoneNumberDigitsOnly;
  var phoneNumberString = phoneNumberDigitsOnly.toString();

  // Wrong number of digits in phone number
  if (phoneNumberString.length != 10) {
    console.log('Incorrect # of digits');
    alert('Please fix your phone number.');
    return false;
  }

  // Correct #.  Reformat with parenthesis
  else {
    var phoneNumberString = phoneNumberDigitsOnly.toString();
    reformatedPhoneNumber =
      '(' +
      phoneNumberString.slice(0,3) +
      ')' +
      phoneNumberString.slice(3,6) +
      '-' +
      phoneNumberString.slice(6,10);
      phoneNumberEl.value = reformatedPhoneNumber;
  }

  /* ------- Validate Guest List ------ */
  var fname, lname;
  var numGuests = 0;
  var i;

  for (i = 1; i < 11; i++) {
    console.log(`------------i: ${i}`);
    // Check if for missing last name (first name filled out but last name missing)
    fnameExpression = `document.forms[\"registration-form\"][\"guest_fname_${i}\"].value`
    lnameExpression = `document.forms[\"registration-form\"][\"guest_lname_${i}\"].value`
    console.log("fnameExpression", fnameExpression);
    console.log("lnameExpression", lnameExpression);
    console.log(`fnameExpression: ${fnameExpression}, lnameExpression: ${lnameExpression}`);
    fname = eval(fnameExpression);
    lname = eval(lnameExpression);

    if ( (fname.length > 0) && (lname == "") ) {
        alert("Someone's last name is missing in your guest list");
        return false;
    }

    // Check if for missing last name (first name filled out but last name missing)
    // fname = document.forms["registration-form"]["guest-fname-1"].value;
    // lname = document.forms["registration-form"]["guest-lname-1"].value;

    if ( (lname.length > 0) && (fname == "") ) {
        alert("Someone's first name is missing in your guest list");
        return false;
    }

    // Count guests
    if (fname.length > 0) {
      numGuests++;
    }

  }

  // update numGuests input
  // console.log("numGuests", numGuests);
  // var numGuestsEl = document.querySelector('#numGuests');
  // numGuestsEl.value = numGuests;
}
