$( document ).ready(function() {
  // Script for Banquet Registration
  if (document.title == 'Banquet Registration') {
    console.log('activating copyfield script');

    demo123CF_CopyFieldValue.setFieldOriginID('#registrantFirstName');
    demo123CF_CopyFieldValue.setFieldDestinationID('#guestFirstName1');
    demo123CF_CopyFieldValue.init();

    demo123CF_CopyFieldValue2.setFieldOriginID('#registrantLastName');
    demo123CF_CopyFieldValue2.setFieldDestinationID('#guestLastName1');
    demo123CF_CopyFieldValue2.init();
  }
  else {
    console.log('copy field script not activated');
  }


  if (document.title == "Order Confirmed") {
    console.log('activating Order Confirmed Hidden Page script for autoselect and auto click');
    proceedToCheckout();
  }
  else {
    console.log('Order Confirmed Hidden Page script for autoselect and auto click NOT activated');
  }
});
