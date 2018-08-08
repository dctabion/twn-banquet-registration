$( document ).ready(function() {
  if (document.title == 'Banquet Registration') {
    console.log('activating copyfield script');

    demo123CF_CopyFieldValue.setFieldOriginID('#registrantFirstName');
    demo123CF_CopyFieldValue.setFieldDestinationID('#guestFirstName01');
    demo123CF_CopyFieldValue.init();

    demo123CF_CopyFieldValue2.setFieldOriginID('#registrantLastName');
    demo123CF_CopyFieldValue2.setFieldDestinationID('#guestLastName01');
    demo123CF_CopyFieldValue2.init();
  }


  else {
    console.log('copy field script not activated');
  }
});
