var v = require('./vindication')

let toValidate = {
	'name': {
		'salutation': '',
		'middleName': '',
		'lastName': 'kek'
	},
	'country': ''
}

console.log(toValidate)

console.log(
	v.validate(toValidate, {
		name: {
			firstName: { required: true }
		}
	} )
)
