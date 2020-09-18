const _ = require('isa.js')

let regexes = {
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

const modderProps = [ '_outer', 'message', 'condition', 'typeof' ]
const props = [
	'required', 'forbidden', 'hasKey', 'minlength',
	'maxlength', 'length',
	'element', 'keyElement', 'greater', 'min',
	'less', 'max',
	'range', 'pattern', 'equalto', 'before',
	'after', 'typeof', 'typeIn', 'notblank'
]

const ERROR_MSG = 'This value seems to be invalid: {value} for {key}'
function defined (value) {
	return value !== undefined && value !== null
}
function templating (string, ...parameters) {
	let options = parameters.length === 1 && _.isObject( parameters[0] ) ? parameters[0] : parameters

	return string.replace(/\{([0-9a-zA-Z_]+)\}/g, (match, i, index) => {
		if (string[index - 1] === '{' &&
			string[index + match.length] === '}') {
			return i
		} else {
			return options.hasOwnProperty(i) && defined( options[i] ) ? JSON.stringify(options[i]) : 'undefined'
		}
	})
}

let Vindication = {
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
		if ( _.isNumber(cvalue) ) {
			cvalue = [ cvalue, cvalue ]
		}
		else if ( _.isString(cvalue) ) {
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
		let tv = _.isString( cvalue ) ? cvalue.toLowerCase() : cvalue
		if (tv === 'function' || tv === Function)
			return _.isFunction( object )
		else if (tv === 'string' || tv === String)
			return _.isString( object )
		else if (tv === 'array' || tv === Array)
			return Array.isArray( object )
		else if (tv === 'number' || tv === Number)
			return typeof ( object ) !== 'undefined' && object !== null && _.isNumber( object )
		else if (tv === 'boolean' || tv === Boolean)
			return typeof ( object ) !== 'undefined' && object !== null && _.isBoolean( object )
		else if (tv === 'object' || tv === Object)
			return typeof ( object ) !== 'undefined' && object !== null && _.isObject( object )

		let regExp = regexes[ cvalue ]
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
		let self = this
		if ( _.isFunction( constraints ) ) {
			if ( !constraints.call( context, object, root ) )
				return templating( constraints.message || ERROR_MSG, { value: object, key: 'Fn' } )
		}
		else if ( _.isArray( constraints ) ) {
			let vals = []
			for (let constraint of constraints ) {
				let val = self.checkConstraints(root, object, constraint, context, options)
				if ( val )
					vals.push( val )
			}
			return vals.length === 0 ? null : vals[0]
		}
		else {
			if ( options.ignores )
				for ( let idx = 0; idx < options.ignores.length; ++idx )
					if ( constraints[ options.ignores[idx] ] )
						return null
			if ( constraints.condition && !constraints.condition.call( context, object ) )
				return null
			if ( constraints.convert )
				object = constraints.convert.call( context, object, root )
			if ( (typeof object === 'undefined' || (object === '') || (object === null)) && !constraints.required && !constraints.forbidden )
				return null
			for (let key in constraints) {
				if ( modderProps.includes( key ) ) continue
				let constraint = constraints[key]
				if ( !constraint.condition || constraint.condition.call( context, object ) ) {
					if (!self[ key + 'Fn' ])
						return 'This constraint is invalid: ' + key
					let resp = self[ key + 'Fn' ](object, constraint.params || constraint) ? null : templating( constraints.message || ERROR_MSG, { value: object, key } )
					if ( resp )
						return resp
				}
			}
			if (constraints.typeof)
				return self.typeofFn(object, constraints.typeof) ? null : templating( constraints.message || ERROR_MSG, { value: object, key: 'typeof' } )
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
	walkConstraints ( constraints, options ) {
		if ( !constraints || !_.isObject( constraints ) )
			throw new Error( `This value seems to be invalid: ${constraints}` )

		if ( _.isFunction( constraints ) )
			return true

		let self = this
		let keys = Object.keys( constraints )
		if ( keys.find( (key) => { return props.includes( key ) } ) ) {
			for (let key of keys)
				if ( !props.includes( key ) && !modderProps.includes( key ) )
					throw new Error( `This key is not valid: ${key}` )
		}
		else for (let key of keys)
			self.walkConstraints( constraints[ key ], options )

		return true
	},
	isConstraint ( constraint = {} ) {
		if (!constraint) return false

		let keys = Object.keys( constraint )
		for (let key of keys)
			if ( !props.includes( key ) )
				return false
		return true
	},
	hasConstraint ( constraint = {} ) {
		if (!constraint) return false
		if ( this.isConstraint( constraint ) ) return true

		let keys = Object.keys( constraint )
		for (let key of keys)
			if ( constraint[key] && _.isObject(constraint[key]) && this.embedConstraint( constraint[key] ) ) return true

		return false
	},
	walk ( root, object, constraints, context, options ) {
		let self = this, res
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


		if ( constraints._outer ) {
			let obj = self.checkConstraints( root, object, constraints._outer, context, options )
			if ( obj )
				return obj

			constraints = _.pick( constraints, null, [ '_outer' ] )
		}

		if ( Object.keys(constraints).length === 0 )
			return null

		if ( Array.isArray( object ) ) {
			res = []
			for (let element of object) {
				let result = self.walk( root, element, constraints, context, options )
				if ( result )
					res.push( result )
			}
			return res.length === 0 ? null : res
		}
		else if ( _.isFunction( object ) ) {
			return self.checkConstraints( root, object, constraints, context, options )
		}
		else if ( _.isObject( object ) ) {
			if ( _.isFunction( constraints ) ) {
				return self.checkConstraints( root, object, constraints, context, options )
			}
			else {
				res = {}
				let keys = Object.keys( options.sourceBased ? object : constraints )

				if ( self.isConstraint(constraints) && !self.hasConstraint(constraints) )
					return self.checkConstraints( root, object, constraints, context, options )

				for (let key of keys) {
					if ( key && constraints[key] ) {
						let n = object[key]
						let result = self.walk( root, n, constraints[key], context, options )
						if ( result )
							res[key] = result
					}
				}
				return Object.keys(res).length === 0 ? null : res
			}
		}
		return null
	}
}

function collectContraint (constraints, chain) {
	let ref = constraints
	for ( let i = 0; i < chain.length && ref; ++i )
		ref = ref[ chain[i] ]
	return ref
}

module.exports = {
	defaultValue ( validation ) {
		if (!validation || !validation.typeof) return ''

		let typeName = validation.typeof
		let tv = _.isString( typeName ) ? typeName.toLowerCase() : typeName
		if (tv === 'function' || tv === Function)
			return () => {}
		else if (tv === 'string' || tv === String)
			return ''
		else if (tv === 'array' || tv === Array)
			return []
		else if (tv === 'number' || tv === Number)
			return 0
		else if (tv === 'boolean' || tv === Boolean)
			return false
		else if (tv === 'object' || (!_.isString( tv ) && _.isObject(tv)))
			return {}

		return ''
	},
	changeRegex (name, regex) {
		regexes[ name ] = regex
	},
	validateValue (value, path, constraints, context, options) {
		let constraint = collectContraint( constraints, path.split('.') )
		return Vindication.walk( value, value, constraint || {}, context || value, options || {} )
	},
	validateConstraints (constraints, options) {
		return Vindication.walkConstraints( constraints || {}, options || {} )
	},
	validate (object, constraints, context, options) {
		return Vindication.walk( object, object, constraints || {}, context || object, options || {} )
	},
	validateAll (objects, constraints, context, options) {
		if ( !Array.isArray( objects ) ) return this.validate( objects, constraints, context )
		let res = []
		for (let object of objects) {
			res.push( Vindication.walk( object, object, constraints || {}, context || object, options || {} ) )
		}
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
