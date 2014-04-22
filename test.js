var f = require('./vindication');

var s = f.validate(
	{
		firstName: "Bob",
		lastName: "Smith",
		salary: 50000,
		roles: [ ":::manager", "supermanager", "kingmanager", "ultramanager" ],
		address:{
			country: "France",
			city: "Paris",
			zipCode: 75009,
			street: "Haussmann 40"
		}
	},
	{
		firstName: { required: true, type: "alphanum" },
		lastName: { minlength: "1", type: "alphanum" },
		salary: { min: 80000 },
		roles: { pattern:/^\w+$/ },
		address:{
			country: { minlength: 6 },
			city: { equalto: {
					params:"Monaco", condition: function(viewModel){ return viewModel.address.country() === 'France'; }
			} },
			zipCode: { range: [10000, 100000] },
			street: { length:[5, 50] }
		}
	}
);

console.log( s );
