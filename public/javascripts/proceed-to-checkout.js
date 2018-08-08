function proceedToCheckout() {
  console.log('-------proceedToCheckout()');
  /* Autoselect the correct # of seats */
  // Select option
  var options = document.getElementsByTagName('option');
  console.log(options);

  var numGuests = document.getElementById('numGuests').value;
  console.log(`numGuests: ${numGuests}`);

  options[numGuests-1].setAttribute("selected", "");

  // Autopress the Paypal Add to Cart button to go to Paypal checkout page
  var daButton = document.getElementById('paypalAddToCartButton');
  console.log('daButton', daButton);
  daButton.click();
}
