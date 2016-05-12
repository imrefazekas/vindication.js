var f = require('./vindication')

var s

var object = {
	firstName: 'Bob',
	lastName: 'Smith',
	salutation: 'Dr.',
	salary: 50000,
	roles: [ ':::manager', 'supermanager', 'kingmanager', 'ultramanager' ],
	address: {
		country: 'France',
		city: 'Paris',
		zipCode: 75009,
		street: 'Haussmann 40'
	},
	title: 'Magesty'
}

var rules = {
	firstName: { required: true, type: 'alphanum' },
	lastName: { minlength: '1', type: 'alphanum' },
	salary: { min: 80000 },
	roles: { pattern: /^\w+$/ },
	salutation: function ( value ) {
		console.log('salutation....')
		return value !== 'Dr.'
	},
	address: {
		country: { minlength: 6, element: ['France'] },
		city: { equalto: {
			params: 'Monaco', condition: function ( value ) { return this.address.country === 'France' }
		} },
		zipCode: { range: [10000, 100000] },
		street: { length: '[5, 50]' }
	},
	papers: {
		id: { required: true }
	},
	title: [
		{ element: ['Lord'] },
		{ minlength: '5' },
		function ( value ) {
			return value === 'Sir'
		}
	]
}

s = f.validate( object, rules )

console.log( s )

s = f.validateAll( [object], rules )

console.log( s )

s = f.validate( '', { type: 'email' } )

console.log( s )

s = f.validate( { email: '' }, { email: { type: 'email' } } )

console.log( s )

s = f.validateValue( 'a@b.hu', 'thing.email', { thing: { email: { type: 'email' } } } )
