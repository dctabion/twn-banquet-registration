function validateForm() {
  console.log('validateForm()');

  var fname, lname;
  var numGuests = 0;
  var i;

  for (i = 1; i < 11; i++) {
    console.log(`------------i: ${i}`);
    // Check if for missing last name (first name filled out but last name missing)
    fnameExpression = `document.forms[\"registration-form\"][\"guest-fname-${i}\"].value`
    lnameExpression = `document.forms[\"registration-form\"][\"guest-lname-${i}\"].value`
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
  console.log("numGuests", numGuests);
  var numGuestsEl = document.querySelector('#numGuests');
  numGuestsEl.value = numGuests;










}
