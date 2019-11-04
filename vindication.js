var _ = require('isa.js')

var regexes = {
	numeric: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
	digits: /^\d+$/,
	integer: /^-?\d+$/,
	alphanum: /^\w+$/,
	password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z\u00C0-\u017F!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,32}$/,
	name: /^[a-zA-Z\u00C0-\u017F]+\.?\s?[a-zA-Z\u00C0-\u017F]+[.,-]?\.?\s?[a-zA-Z\u00C0-\u017F]+[.,-]?$/,
	nameExt: /^[a-zA-Z0-9\u00C0-\u017F]+\.?\s?[a-zA-Z0-9\u00C0-\u017F]+[.,-]?\.?\s?[a-zA-Z0-9\u00C0-\u017F]+[.,-]?$/,
	address: /^[a-zA-Z\u00C0-\u017F0-9-.,/\s]+$/,
	email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
	url: new RegExp('(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)', 'i'),
	dateIso: /^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$/,
	phone: /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/
}

let modderProps = [ 'enforceLevel', 'message', 'condition', 'typeof' ]
let props = [
	'required', 'forbidden', 'hasKey', 'minlength',
	'maxlength', 'length',
	'element', 'keyElement', 'greater', 'min',
	'less', 'max',
	'range', 'pattern', 'equalto', 'before',
	'after', 'typeof', 'typeIn', 'notblank'
]

var Vindication = {
	hasKeyFn ( object, cvalue ) {
		return !cvalue || (object && Object.keys( object ).length > 0)
	},
	requiredFn ( object, cvalue ) {
		return !cvalue || object || object === '' || _.isNumber(object) || _.isBoolean(object)
	},
	forbiddenFn ( object, cvalue ) {
		return !cvalue || !object
	},
	minlengthFn ( object, cvalue ) {
		return object && object.length >= cvalue
	},
	maxlengthFn ( object, cvalue ) {
		return !object || object.length <= cvalue
	},
	lengthFn ( object, cvalue ) {
		if ( _.isString(cvalue) ) {
			cvalue = JSON.parse( cvalue )
		}
		return this.minlengthFn( object, cvalue[ 0 ] ) && this.maxlengthFn( object, cvalue[ 1 ] )
	},
	elementFn ( object, cvalue ) {
		return Array.isArray(cvalue) && cvalue.indexOf( object ) !== -1
	},
	keyElementFn ( object, cvalue ) {
		return Array.isArray(cvalue) && Object.keys(object).filter( (value) => { return cvalue.indexOf( value ) !== -1 } ).length === Object.keys(object).length
	},
	greaterFn ( object, cvalue ) {
		return _.isNumber(object) && object > cvalue
	},
	minFn ( object, cvalue ) {
		return _.isNumber(object) && object >= cvalue
	},
	lessFn ( object, cvalue ) {
		return _.isNumber(object) && object < cvalue
	},
	maxFn ( object, cvalue ) {
		return _.isNumber(object) && object <= cvalue
	},
	rangeFn ( object, cvalue ) {
		return _.isNumber(object) && object >= cvalue[ 0 ] && object <= cvalue[ 1 ]
	},
	patternFn ( object, cvalue ) {
		return new RegExp( cvalue ).test( object )
	},
	equaltoFn ( object, cvalue ) {
		return object === cvalue
	},
	notblankFn ( object, cvalue ) {
		return !cvalue || this.minlengthFn( object, 1 )
	},
	beforeFn ( object, cvalue ) {
		return this.maxFn( object.getTime ? object.getTime() : object, cvalue.getTime ? cvalue.getTime() : cvalue )
	},
	afterFn ( object, cvalue ) {
		return this.minFn( object.getTime ? object.getTime() : object, cvalue.getTime ? cvalue.getTime() : cvalue )
	},
	typeofFn ( object, cvalue ) {
		let tv = cvalue.toLowerCase()
		if (tv === 'function')
			return _.isFunction( object )
		else if (tv === 'string')
			return _.isString( object )
		else if (tv === 'array')
			return Array.isArray( object )
		else if (tv === 'number')
			return typeof ( object ) !== 'undefined' && object !== null && _.isNumber( object )

		var regExp = regexes[ cvalue ]
		if (!regExp) return false

		let exists = typeof ( object ) !== 'undefined' && object !== null
		if (!exists) return false

		return regExp.test( _.isString( object ) ? object : object + '' )
	},
	typeInFn ( object, cvalue ) {
		for (let element of cvalue)
			if ( Vindication.typeofFn( object, element ) )
				return true
		return false
	},
	_checkConstraints ( root, object, constraints, context, options ) {
		var self = this
		if ( _.isFunction( constraints ) ) {
			if ( !constraints.call( context, object ) )
				return 'This value seems to be invalid:' + ' ' + object
		}
		else if ( _.isArray( constraints ) ) {
			var vals = []
			constraints.forEach(function ( constraint ) {
				var val = self.checkConstraints(root, object, constraint, context, options)
				if ( val )
					vals.push( val )
			} )
			return vals.length === 0 ? null : vals[0]
		}
		else {
			if ( options.ignores )
				for ( var idx = 0; idx < options.ignores.length; ++idx )
					if ( constraints[ options.ignores[idx] ] )
						return null
			if ( constraints.condition && !constraints.condition.call( context, object ) )
				return null
			if ( constraints.convert )
				object = constraints.convert.call( context, object, root )
			if ( (typeof object === 'undefined' || (object === '') || (object === null)) && !constraints.required && !constraints.forbidden )
				return null
			for (var key in constraints) {
				if ( modderProps.includes( key ) ) continue
				var constraint = constraints[key]
				if ( !constraint.condition || constraint.condition.call( context, object ) ) {
					if (!self[ key + 'Fn' ])
						return 'This constraint is invalid: ' + key
					var resp = self[ key + 'Fn' ](object, constraint.params || constraint) ? null : (constraints.message || 'This value seems to be invalid:') + ' ' + object
					if ( resp )
						return resp
				}
			}
			if (constraints.typeof)
				return self.typeofFn(object, constraints.typeof) ? null : 'This value seems to be invalid: ' + object
		}
		return null
	},
	checkConstraints ( root, object, constraints, context, options ) {
		try {
			return this._checkConstraints( root, object, constraints, context, options )
		}
		catch (err) {
			console.error(err, object, constraints)
		}
	},
	walk ( root, object, constraints, context, options ) {
		var self = this, res
		if ( (typeof (object) === 'undefined' || object === null) && constraints ) {
			return self.checkConstraints( root, object, constraints, context, options )
		}
		else if ( _.isString( object ) ) {
			return self.checkConstraints( root, object, constraints, context, options )
		}
		else if ( _.isBoolean( object ) ) {
			return self.checkConstraints( root, object, constraints, context, options )
		}
		else if ( _.isNumber( object ) ) {
			return self.checkConstraints( root, object, constraints, context, options )
		}
		else if ( _.isDate( object ) ) {
			return self.checkConstraints( root, object, constraints, context, options )
		}
		else if ( _.isRegExp( object ) ) {
			return null
		}
		else if ( !constraints.enforceLevel && Array.isArray( object ) ) {
			res = []
			if ( constraints._validator ) {
				var obj = self.checkConstraints( root, object, constraints._validator, context, options )
				if ( obj )
					res.push( obj )
			}
			object.forEach(function (element) {
				var result = self.walk( root, element, constraints, context, options )
				if ( result )
					res.push( result )
			})
			return res.length === 0 ? null : res
		}
		else if ( !constraints.enforceLevel && _.isFunction( object ) ) {
			return self.checkConstraints( root, object, constraints, context, options )
		}
		else if ( _.isObject( object ) ) {
			if ( _.isFunction( constraints ) ) {
				return self.checkConstraints( root, object, constraints, context, options )
			}
			else {
				res = {}
				if ( constraints._validator ) {
					return self.checkConstraints( root, object, constraints._validator, context, options )
				}
				else {
					let keys = Object.keys( options.sourceBased ? object : constraints )
					if ( keys.find( (key) => { return props.includes( key ) } ) )
						return self.checkConstraints( root, object, constraints, context, options )
					for (let key of keys) {
						if ( key && constraints[key] ) {
							var n = object[key]
							var result = self.walk( root, n, constraints[key], context, options )
							if ( result )
								res[key] = result
						}
					}
				}
				return Object.keys(res).length === 0 ? null : res
			}
		}
		return null
	}
}

function collectContraint (constraints, chain) {
	var ref = constraints
	for ( var i = 0; i < chain.length && ref; ++i )
		ref = ref[ chain[i] ]
	return ref
}

module.exports = {
	changeRegex (name, regex) {
		regexes[ name ] = regex
	},
	validateValue (value, path, constraints, context, options) {
		var constraint = collectContraint( constraints, path.split('.') )
		return Vindication.walk( value, value, constraint || {}, context || value, options || {} )
	},
	validate (object, constraints, context, options) {
		return Vindication.walk( object, object, constraints || {}, context || object, options || {} )
	},
	validateAll (objects, constraints, context, options) {
		if ( !Array.isArray( objects ) ) return this.validate( objects, constraints, context )
		var res = []
		objects.forEach(function (object) {
			res.push( Vindication.walk( object, object, constraints || {}, context || object, options || {} ) )
		})
		return res
	},
	validateByProto (object, prototype, options = {}) {
		if (!prototype) return true
		if (!object) throw new Error('Object seem to be empty')

		let protoKeys = Object.keys( prototype )
		for (let protoKey of protoKeys)
			if ( !object.hasOwnProperty( protoKey ) )
				throw new Error('Property is missing: ' + protoKey)

		let addKeys = Object.keys( object ).filter( (key) => { return !protoKeys.includes(key) } )
		if (addKeys.length > 0)
			throw new Error('Additional properties detected: ' + addKeys.join(', ') )
		return true
	},
	pick (object, predicate) {
		return _.pick( object, predicate )
	}

}
