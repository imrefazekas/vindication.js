(function () {
	var root = this;

	var Vindication = function(obj) {
		if (obj instanceof Vindication) return obj;
		if (!(this instanceof Vindication)) return new Vindication(obj);
		this._wrapped = obj;
	};

	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = Vindication;
		}
		exports.Vindication = Vindication;
	} else {
		root.Vindication = Vindication;
	}

	Vindication.VERSION = "2.2.0";

	var toString = Object.prototype.toString;

	Vindication.extend = function(target, source) {
		if( !source ) return target;
		if( !target ) target = { };
		if ( Vindication.isObject( source ) )
			for (var prop in source)
				if (prop in target)
					Vindication.extend(target[prop], source[prop]);
				else
					target[prop] = source[prop];
		return target;
	};

	Vindication.isString = function (obj) {
		return "[object String]" === toString.call(obj);
	};

	Vindication.isObject = function (obj) {
		var type = typeof obj;
		return type === 'function' || type === 'object' && !!obj;
	};

	Vindication.isNumber = function (obj) {
		return (toString.call(obj) === "[object " + Number + "]") || !isNaN(obj);
	};

	Vindication.isDate = function (obj) {
		return toString.call(obj) === "[object " + Date + "]";
	};

	Vindication.isFunction = function (obj) {
		return toString.call(obj) === "[object " + Function + "]";
	};

	Vindication.isArray = Array.isArray || function(obj) {
		return toString.call(obj) === '[object Array]';
	};

	if (typeof (/./) !== 'function') {
		Vindication.isFunction = function(obj) {
			return typeof obj === 'function';
		};
	}

	Vindication.isRule = function(obj){
		return obj && Vindication.isObject( obj ); // && !Vindication.isFunction(obj);
	};

	Vindication.requiredFn = function ( object, cvalue ) {
		return !cvalue || object;
	};
	Vindication.minlengthFn = function ( object, cvalue ) {
		return object && object.length >= cvalue;
	};
	Vindication.maxlengthFn = function ( object, cvalue ) {
		return object && object.length <= cvalue;
	};
	Vindication.lengthFn = function ( object, cvalue ) {
		if( Vindication.isString(cvalue) ){ cvalue = JSON.parse( cvalue ); }
		return Vindication.minlengthFn( object, cvalue[ 0 ] ) && Vindication.maxlengthFn( object, cvalue[ 1 ] );
	};
	Vindication.elementFn = function ( object, cvalue ) {
		return Vindication.isArray(cvalue) && cvalue.indexOf( object ) !== -1;
	};
	Vindication.minFn = function ( object, cvalue ) {
		return object && Number( object ) >= cvalue;
	};
	Vindication.maxFn = function ( object, cvalue ) {
		return object && Number( object ) <= cvalue;
	};
	Vindication.rangeFn = function ( object, cvalue ) {
		return object && object >= cvalue[ 0 ] && object <= cvalue[ 1 ];
	};
	Vindication.patternFn = function ( object, cvalue ) {
		return new RegExp( cvalue ).test( object );
	};
	Vindication.equaltoFn = function ( object, cvalue ) {
		return object === cvalue;
	};
	Vindication.mincheckFn = function ( object, cvalue ) {
		return Vindication.minlengthFn( object, cvalue );
	};
	Vindication.maxcheckFn = function ( object, cvalue ) {
		return Vindication.maxlengthFn( object, cvalue );
	};
	Vindication.checkFn = function ( object, cvalue ) {
		return Vindication.lengthFn( object, cvalue );
	};
	Vindication.typeFn = function ( object, cvalue ) {
		var regExp;

		switch ( cvalue ) {
			case 'number':
				regExp = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;
				break;
			case 'digits':
				regExp = /^\d+$/;
				break;
			case 'integer':
				regExp = /^-?\d+$/;
				break;
			case 'alphanum':
				regExp = /^\w+$/;
				break;
			case 'email':
				regExp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
				break;
			case 'url':
				regExp = new RegExp('(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)', 'i');
				break;
			case 'dateIso':
				regExp = /^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$/;
				break;
			case 'phone':
				regExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
				break;
			default:
				return false;
		}

		// test regExp if not null
		return '' !== object ? regExp.test( object ) : false;
	};

	Vindication.checkConstraints = function( model, objectFunc, constraints ) {
		var object = objectFunc();
		if( Vindication.isFunction( constraints ) ){
			if( !constraints.call( model, object ) )
				return 'This value seems to be invalid:' + ' ' + object;
		}
		else for (var key in constraints){
			if( key !== 'message' ){
				var constraint = constraints[key];
				if( constraint.params && constraint.condition ){
					if( constraint.condition(model) ){
						var cresp = Vindication[ key + 'Fn' ](object, constraint.params) ? null : (constraints.message || 'This value seems to be invalid:') + ' ' + object;
						if( cresp )
							return cresp;
					}
				}
				else{
					var resp = Vindication[ key + 'Fn' ](object, constraint) ? null : (constraints.message || 'This value seems to be invalid:') + ' ' + object;
					if( resp )
						return resp;
				}
			}
		}
	};

	Vindication.validateAll = function (objArray, rules, context) {
		var result = {};
		for(var i=0; i<objArray.length; i+=1){
			var obj = objArray[i];
			var validation = Vindication.validate( obj, rules, context );
			if( validation )
				result[ i ] = validation;
		}
		return result;
	};

	Vindication.validate = function (obj, rules, context) {
		var self = context || this;
		return (function( data, validationRules ){

			function functify( object, constraints ) {
				var res = object;
				if (
					Vindication.isRule(constraints) &&
					(Vindication.isString(object) || Vindication.isDate(object) || Vindication.isNumber(object) || Vindication.isFunction(object))
				){
					res = function(){ return object; };
				}
				else if ( Vindication.isArray(object) ){
					res = [];
					if( Vindication.isRule(constraints) )
						for (var index in object)
							if( object[index] )
								res.push( functify( object[index], constraints ) );
				}
				else if ( Vindication.isObject(object) ){
					res = {};
					if( constraints )
						for (var key in object)
							if( Vindication.isRule(constraints[key]) )
								res[key] = functify( object[key], constraints[key] );
				}
				return res;
			}

			function requiredWalk( model, object, constraints ) {
				var res;
				var emptyFn = function(){ return null; };
				if ( Vindication.isObject( constraints ) ){
					for (var key in constraints){
						if( constraints[key].required && !object[key] ){
							if( !res ) res = { };
							res[ key ] = Vindication.checkConstraints( model, emptyFn, constraints[key] );
						} else {
							var respo = requiredWalk( model, object[key] || {}, constraints[key] );
							if( respo ){
								if( !res ) res = { };
								res[ key ] = respo;
							}
						}
					}
				}
				return res;
			}

			function walk( model, object, constraints ) {
				var res;
				if ( Vindication.isFunction(object) ){
					if(constraints)
						return Vindication.checkConstraints( model, object, constraints );
				}
				else if ( Vindication.isArray(object) ){
					for (var index in object){
						if( constraints ){
							var resp = walk( model, object[index], constraints );
							if( resp ){
								if(!res)
									res = [];
								res.push( resp );
							}
						}
					}
				}
				else if ( Vindication.isObject(object) ){
					for (var key in object){
						if( constraints[key] ){
							var respo = walk( model, object[key], constraints[key] );
							if( respo ){
								if(!res)
									res = {};
								res[key] = respo;
							}
						}
					}
				}

				return res;
			}

			var model = functify( data, validationRules );

			var requiredValidation = requiredWalk( model, model, validationRules );
			var normalValidation = walk( model, model, validationRules );

			return Vindication.extend( requiredValidation, walk( model, model, validationRules ) );
		}( obj, rules ));
	};

}).call(this);
