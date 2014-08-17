Vindication.js - dependency-free validation library

[![NPM](https://nodei.co/npm/vindication.js.png)](https://nodei.co/npm/vindication.js/)
========

[vindication.js](https://github.com/imrefazekas/vindication.js) is a dependency-free extremely small library aiding the validation processes for objects. Can be used on both server and client side.

By passing an object and a constraint rule object, the object will be validated and the function will return with the possible errors or undefined.
The data object will be iterated through recursively along/parallel with the constraint rule object and if any pairing rule can be identified will be matched against the given value.

Features:

- simple value-based rules: required, notblank, minlength, equalto
- regular expression rules
- conditional validation: validation rule based on a condition evaluated realtime
- regular expression-based type rules: email, url, date, phone, etc.
- range-based validations
- rules for arrays type values
- customizable error messages


For a more complex scenario please find a complex project boilerplate: [Division.js](https://github.com/imrefazekas/division.js), where one business model is defined and maintained allowing you to use the same objects - including model and validation and computed values and associated functions - on both client side, server side and DB interaction!


Usage:

- [Server-side](#server-side)
- [Client-side](#client-side)
- [Rules](#rules)


## Server-side

Command line:

	npm install vindication.js

In [node.js](www.nodejs.org) code:

	var v = require('./vindication');
	...
	var s = v.validate(
		{
			firstName: "Bob",
			lastName: "Smith",
			salutation: 'Dr.',
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
			salutation: function( value ){
				console.log('salutation....');
				return value !== 'Dr.';
			},
			address:{
				country: { minlength: 6 },
				city: { equalto: {
						params: "Monaco", condition: function(viewModel){ return viewModel.address.country() === 'France'; }
				} },
				zipCode: { range: [10000, 100000] },
				street: { length:[5, 50] }
			}
		}
	);

	console.log( s );

Result:

	{
		salutation: 'This value seems to be invalid: Dr.',
		salary: 'This value seems to be invalid: 50000',
		roles: [ 'This value seems to be invalid: :::manager' ],
		address: { city: 'This value seems to be invalid: Paris' }
	}


## Client-side

In _head_

	<script src='vindication.min.js'></script>

In any _script_ tag

	vindication.validate( obj, rules );


## Rules

The rule syntax is simple as 1. For every attribute inside an object at whatever level, you can define a rule object possessing a subset of the following definitions:

	required : true
	minlength : 6
	maxlength : 6
	length: [5,10]
	min : 6
	max : 100
	element : [ 'PossibleValue1', 'PossibleValue1' ]
	range : [6, 100]
	pattern : '<regexp>'
	equalto : '#elem'
	mincheck : 2
	maxcheck : 2
	check : [1,2]

	type : email'
	type : url'
	type : urlstrict'
	type : digits'
	type : number'
	type : alphanum'
	type : dateIso'
	type : phone'

	message : 'Custom error message'

The syntax of rules is inherited from [parsley](http://parsleyjs.org) v2, which could be the simplest and greatest validation library for web pages.

You can go beyond these rules by defining conditional rules as well:

	city: {
		equalto: {
			params:"Paris", condition: function(viewModel){ return viewModel.address.country() === 'France'; }
		}
	}

This _equalto_ rule is validated only if the condition function returns true.
