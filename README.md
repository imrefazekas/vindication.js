Vindication.js - dependency-free validation library

[![NPM](https://nodei.co/npm/vindication.js.png)](https://nodei.co/npm/vindication.js/)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

========

[vindication.js](https://github.com/imrefazekas/vindication.js) is an extremely small library aiding the validation processes for objects. Can be used on both server and client side, follows CommonJS module format.

Object to be checked and Object enclosing constraints are plain JS objects.

By passing an object and a constraint rule object, the object will be validated and the function will return with the detected errors or undefined.
The data object will be iterated through recursively along/parallel with the constraint rule object and if any pairing rule can be identified will be matched against the given value.

Features:

- simple value-based rules: required, notblank, minlength, maxlength, length, range, pattern, greater, less, min, max, equalto, before, after ...
- regular expression rules
- validator functions for complex scenarios and/or structured objects
- conditional validation: validation rule based on a condition evaluated in real-time
- built-in type rules: number, digits, integer, alphanum, password, name, address, email, url, dateIso, phone, string, function, array
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

	let v = require('vindication.js')
	...
	let s = v.validate(
		{
			firstName: 'Bob',
			lastName: 'Smith',
			salutation: 'Dr.',
			salary: 50000,
			roles: [ ':::manager', 'supermanager', 'kingmanager', 'ultramanager' ],
			address:{
				country: 'France',
				city: 'Paris',
				zipCode: 75009,
				street: 'Haussmann 40'
			}
		},
		{
			firstName: { required: true, typeof: 'alphanum' },
			lastName: { minlength: '1', typeof: 'alphanum' },
			salary: { min: 80000 },
			roles: { pattern:/^\w+$/ },
			salutation: function( value ){
				console.log('salutation....')
				return value !== 'Dr.'
			},
			address:{
				country: { minlength: 6, element: ['Germany'] },
				city: { equalto: {
						params: 'Monaco', condition: function(value){ return this.address.country() === 'France' }
				} },
				zipCode: { range: [10000, 100000] },
				street: { length:[5, 50] }
			}
		}
	)

	console.log( s )

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

required, hasKey, element, keyElement, typeof, notblank, notblank, minlength, maxlength, length, greater, less, range, pattern, min, max, equalto, before, after

	required : true
	notblank: true
	minlength : 6
	maxlength : 6
	length: [5,10]
	greater : 6
	min : 6
	less : 100
	max : 100
	element : [ 'PossibleValue1', 'PossibleValue2' ]
	hasKey: true
	keyElement: [ 'length' ], 
	range : [6, 100]
	pattern : '<regexp>'
	equalto : '#elem'
	before: new Date()
	after: new Date()

	typeof : 'email'

	message : 'Custom error message'


## Rule conversion

A conversion function can be passed to be called before any validation step in order to perform any transformation you might need on that given object

	city: {
		equalto: {
			params: 'Paris', convert: function(value, root){ return value.toUpperCase() }
		}
	}


## Rule precondition

A conditional function can be set to the rules or to a single rule as well to narrow the jurisdiction.


	city: {
		equalto: {
			params: 'Paris', condition: function(value){ return this.address.country() === 'France' }
		}
	}

or

	city: {
		condition: function(value){ return this.address.country() === 'France' },
		equalto: 'Paris',
		minlength: '3'
	}


In the first case, the rule _'equalto'_ will be applied only if the function 'condition' returns true.
The latter case defines a ruleset, where the function _'condition'_ defines the jurisdiction of all rules defined: _'equalto' and 'minlength'.


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
		{ minlength: '5' },
		function( value ){
			return value === 'Sir'
		}
	]


When you call the _validate_ function of [vindication.js](https://github.com/imrefazekas/vindication.js) object, a context param can be also passed used as "this" for such function calling.
Your function might reference to other attributes or structures.


	let s = v.validate( obj, rules, obj )


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

## Custom field types & regexps

Vindication can be altered to adopt new types or new regexp definitions for existing types as follows:

	v.changeRegex( 'password', /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z\u00C0-\u017F]{8,}$/ )
	or
	v.changeRegex( 'strict', /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z\u00C0-\u017F!"#$%&'()*+,-./:;<=>?@[]\^_`{\|}~]{16,}$/ )
