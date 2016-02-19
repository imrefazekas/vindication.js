var object = {
	model: {
		body: {
			content: 'AT111212121212121212',
			detailsOfPayments: ''
		},
		additional: {
			country_code: ''
		}
	},
	validation: {
		body: {
			content: function ( value ) {
				switch ( this.additional.countryCode ) {
				case 'AC': return new RegExp( '^AT[0-9]{2}[0-9]{16}$' ).test( value )
				}
				return true
			},
			detailsOfPayments: { required: false, maxlength: '35', message: 'Special error on details of Payment' }
		}
	}
}

var vindication = require('./vindication.js')

console.log( vindication.validate( object.model, object.validation, object.model ) )
