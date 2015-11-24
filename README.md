Vindication.js - dependency-free validation library

[![NPM](https://nodei.co/npm/vindication.js.png)](https://nodei.co/npm/vindication.js/)
========

[vindication.js](https://github.com/imrefazekas/vindication.js) is an extremely small library aiding the validation processes for objects. Can be used on both server and client side, follows CommonJS module format.

Object to be checked and Object enclosing constraints are plain JS objects.

By passing an object and a constraint rule object, the object will be validated and the function will return with the detected errors or undefined.
The data object will be iterated through recursively along/parallel with the constraint rule object and if any pairing rule can be identified will be matched against the given value.

Features:

- simple value-based rules: required, notblank, minlength, maxlength, length, range, pattern, min, max, equalto, before, after ...
- regular expression rules
- validator functions for complex scenarios and/or structured objects
- conditional validation: validation rule based on a condition evaluated in real-time
- built-in type rules: number, digits, integer, alphanum, email, url, dateIso, phone
- range-based validations
- set possible values for arrays
- customizable error messages
- multiple rules associated to single entities



[Usage](#usage)
[Rules](#rules)


## Usage

Command line:

	npm install vindication.js --save

In JS code:

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
				country: { minlength: 6, element: ["Germany"] },
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
		address: {
			city: 'This value seems to be invalid: Paris'
		}
	}



## Rules

The rule syntax is simple as 1.
For every attribute inside an object at a given level, you can define a rule object possessing a subset of the following definitions:

required, notblank, minlength, maxlength, length, range, pattern, min, max, equalto, before, after

	required : true
	notblank: true
	minlength : 6
	maxlength : 6
	length: [5,10]
	min : 6
	max : 100
	element : [ 'PossibleValue1', 'PossibleValue2' ]
	range : [6, 100]
	pattern : '<regexp>'
	equalto : '#elem'
	before: new Date()
	after: new Date()

	type : 'email'

	message : 'Custom error message'


	city: {
		equalto: {
			params:"Paris", condition: function(viewModel){ return viewModel.address.country() === 'France'; }
		}
	}

This _equalto_ rule is validated only if the condition function returns true.


## Functions

Function can be also passed as constraint:

	{
		firstname: function(value){
			return firstname.length < 10;
		}
	}


## Array of rules

A constraint can be an array of contraint encapsulating any type of contraint above or even arrays:

	title: [
		{ element: ['Lord'] },
		{ minlength: "5" },
		function( value ){
			return value === 'Sir';
		}
	]

When you call the _validate_ function of [vindication.js](https://github.com/imrefazekas/vindication.js) object, a context param can be also passed used as "this" for such function calling.
Your function might reference to other attributes or structures.

	var s = v.validate( obj, rules, obj );


Note: When a rule object is set to an array, all object enclosed by the array will be validated.


## Multiple  validation

One can pass an array of objects as well to be validated as follows:

	var s = v.validateAll( objArray, rules );

All objects will be validated, and the returning object will contain the validation errors referenced by the array index:

	[
		{ salutation: 'This value seems to be invalid: Dr.',
			salary: 'This value seems to be invalid: 50000',
			roles: [ 'This value seems to be invalid: :::manager' ],
			address: { city: 'This value seems to be invalid: Paris' }
		}
	]
