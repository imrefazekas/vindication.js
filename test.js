var f = require('./vindication');

var object = {
	firstName: "Bob",
	lastName: "Smith",
	salutation: 'Dr.',
	salary: 50000,
	roles: [ ":::manager", "supermanager", "kingmanager", "ultramanager" ],
	address: {
		country: "France",
		city: "Paris",
		zipCode: 75009,
		street: "Haussmann 40"
	}
};

var rules = {
	firstName: { required: true, type: "alphanum" },
	lastName: { minlength: "1", type: "alphanum" },
	salary: { min: 80000 },
	roles: { pattern: /^\w+$/ },
	salutation: function( value ){
		console.log('salutation....');
		return value !== 'Dr.';
	},
	address: {
		country: { minlength: 6, element: ["France"] },
		city: { equalto: {
				params: "Monaco", condition: function(viewModel){ return viewModel.address.country === 'France'; }
		} },
		zipCode: { range: [10000, 100000] },
		street: { length: "[5, 50]" }
	},
	papers: {
		id: { required: true }
	}
};

var s = f.validate( object, rules );

console.log( s );

s = f.validateAll( [object], rules );

console.log( s );

s = f.validate( "Bob", { minlength: 16, type: "alphanum" } );

console.log( s );
