(function () {
	var root = this;

	var validator = function(obj) {
		if (obj instanceof validator) return obj;
		if (!(this instanceof validator)) return new validator(obj);
		this._wrapped = obj;
	};

	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = validator;
		}
		exports.validator = validator;
	} else {
		root.validator = validator;
	}

	validator.VERSION = "1.0.3";

	validator.isString = function (obj) {
		return "[object String]" == toString.call(obj);
	};

	validator.isObject = function (obj) {
		return obj === Object(obj);
	};

	validator.isNumber = function (obj) {
		return (toString.call(obj) == "[object " + Number + "]") || !isNaN(obj);
	};

	validator.isDate = function (obj) {
		return toString.call(obj) == "[object " + Date + "]";
	};

	validator.isFunction = function (obj) {
		return toString.call(obj) == "[object " + Function + "]";
	};

	if (typeof (/./) !== 'function') {
		validator.isFunction = function(obj) {
			return typeof obj === 'function';
		};
	}

	validator.isArray = Array.isArray || function (obj) {
		return "[object Array]" == toString.call(obj);
	};

	validator.required = function ( object, cvalue ) {
		return !cvalue || object;
	};
	validator.notblank = function ( object, cvalue ) {
		return validator.isString( object ) && '' !== object.replace( /^\s+/g, '' ).replace( /\s+$/g, '' );
	};
	validator.minlength = function ( object, cvalue ) {
		return object.length >= cvalue;
	};
	validator.maxlength = function ( object, cvalue ) {
		return object.length <= cvalue;
	};
	validator.rangelength = function ( object, cvalue ) {
		return validator.minlength( object, cvalue[ 0 ] ) && validator.maxlength( object, cvalue[ 1 ] );
	};
	validator.min = function ( object, cvalue ) {
		return Number( object ) >= cvalue;
	};
	validator.max = function ( object, cvalue ) {
		return Number( object ) <= cvalue;
	};
	validator.range = function ( object, cvalue ) {
		return object >= cvalue[ 0 ] && object <= cvalue[ 1 ];
	};
	validator.regexp = function ( object, cvalue ) {
		return new RegExp( cvalue ).test( object );
	};
	validator.equalto = function ( object, cvalue ) {
		return object === cvalue;
	};
	validator.mincheck = function ( object, cvalue ) {
		return validator.minlength( object, cvalue );
	};
	validator.maxcheck = function ( object, cvalue ) {
		return validator.maxlength( object, cvalue );
	};
	validator.rangecheck = function ( object, cvalue ) {
		return validator.rangelength( object, cvalue );
	};
	validator.type = function ( object, cvalue ) {
		var regExp;

		switch ( cvalue ) {
			case 'number':
				regExp = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;
				break;
			case 'digits':
				regExp = /^\d+$/;
				break;
			case 'alphanum':
				regExp = /^\w+$/;
				break;
			case 'email':
				regExp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
				break;
			case 'url':
				val = new RegExp( '(https?|s?ftp|git)', 'i' ).test( val ) ? val : 'http://' + val;
				/* falls through */
			case 'urlstrict':
				regExp = /^(https?|s?ftp|git):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
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

	validator.checkConstraints = function ( object, constraints ) {
		for (var key in constraints){
			if( key !== 'message' ){
				var resp = validator[ key ](object, constraints[key]) ? null : (constraints['message'] || 'This value seems to be invalid:') + ' ' + object;
				if( resp )
					return resp;
			}
		}
	};


	validator.validate = function (obj, rules, context) {
		var self = context || this;
		return function( data, validationRules ){

			function walk( object, constraints ) {
				var res;
				if ( validator.isString(object) || validator.isDate(object) || validator.isNumber(object) || validator.isFunction(object) ){
					if(constraints)
						return validator.checkConstraints( object, constraints );
				}
				else if ( validator.isArray(object) ){
					for (var index in object){
						var resp = walk( object[index], constraints );
						if( resp ){
							if(!res)
								res = [];
							res.push( resp );
						}
					}
				}
				else if ( validator.isObject(object) ){
					for (var key in object){
						var respo = walk( object[key], constraints ? constraints[key] : null );
						if( respo ){
							if(!res)
								res = {};
							res[key] = respo;
						}
					}
				}

				return res;
			}

			return walk( data, validationRules );
		}( obj, rules );
	};

}).call(this);