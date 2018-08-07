var demo123CF_CopyFieldValue = new function() {
    var self = this;

    this.errorMessage = '';

    this.id123cf = '#id123-control';
    this.fieldOrigin = '';
    this.fieldDestination = '';

    this.setFieldOriginID = function ( fieldId ) {
        this.fieldOrigin = fieldId;
    }

    this.setFieldDestinationID = function ( fieldId ) {
        this.fieldDestination = fieldId;
    }


    this.init = function () {
        this.setOnChange();
    }

    this.validateData = function () {
        if(!$(this.fieldOrigin).length)
            this.errorMessage = 'Invalid origin field';
        if(!$(this.fieldDestination).length) {
            console.log('this.id123cf', this.id123cf);
            console.log('this.id123cf.length', this.id123cf.length);
            console.log('this.fieldDestination', this.fieldDestination);
            console.log('this.fieldDestination.length', this.fieldDestination.length);
            this.errorMessage = 'Invalid destination field';
        }

        return this.errorMessage == '';
    }

    this.updateDestinationValue = function (){
        if(!this.validateData()) {
            alert(this.errorMessage);
            return;
        }

        $(this.fieldDestination).val($(this.fieldOrigin).val());
    }

    this.setOnChange = function () {
        if(!this.validateData()) {
            alert(this.errorMessage);
            return;
        }

        //change event from start date to be copied to end date
        $(this.fieldOrigin).change(function() {
            self.updateDestinationValue();
        });

    }
}

var demo123CF_CopyFieldValue2 = new function() {
    var self = this;

    this.errorMessage = '';

    this.id123cf = '#id123-control';
    this.fieldOrigin = '';
    this.fieldDestination = '';

    this.setFieldOriginID = function ( fieldId ) {
        this.fieldOrigin = fieldId;
    }

    this.setFieldDestinationID = function ( fieldId ) {
        this.fieldDestination = fieldId;
    }


    this.init = function () {
        this.setOnChange();
    }

    this.validateData = function () {
        if(!$(this.fieldOrigin).length)
            this.errorMessage = 'Invalid origin field';
        if(!$(this.fieldDestination).length) {
            console.log('this.id123cf', this.id123cf);
            console.log('this.id123cf.length', this.id123cf.length);
            console.log('this.fieldDestination', this.fieldDestination);
            console.log('this.fieldDestination.length', this.fieldDestination.length);
            this.errorMessage = 'Invalid destination field';
        }

        return this.errorMessage == '';
    }

    this.updateDestinationValue = function (){
        if(!this.validateData()) {
            alert(this.errorMessage);
            return;
        }

        $(this.fieldDestination).val($(this.fieldOrigin).val());
    }

    this.setOnChange = function () {
        if(!this.validateData()) {
            alert(this.errorMessage);
            return;
        }

        //change event from start date to be copied to end date
        $(this.fieldOrigin).change(function() {
            self.updateDestinationValue();
        });

    }
}
