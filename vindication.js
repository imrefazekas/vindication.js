(function () {
	var root = this;

	var vindication = function(obj) {
		if (obj instanceof vindication) return obj;
		if (!(this instanceof vindication)) return new vindication(obj);
		this._wrapped = obj;
	};

	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = vindication;
		}
		exports.vindication = vindication;
	} else {
		root.vindication = vindication;
	}

	vindication.VERSION = "1.1.0";

	vindication.isString = function (obj) {
		return "[object String]" == toString.call(obj);
	};

	vindication.isObject = function (obj) {
		return obj === Object(obj);
	};

	vindication.isNumber = function (obj) {
		return (toString.call(obj) == "[object " + Number + "]") || !isNaN(obj);
	};

	vindication.isDate = function (obj) {
		return toString.call(obj) == "[object " + Date + "]";
	};

	vindication.isFunction = function (obj) {
		return toString.call(obj) == "[object " + Function + "]";
	};

	if (typeof (/./) !== 'function') {
		vindication.isFunction = function(obj) {
			return typeof obj === 'function';
		};
	}

	vindication.isArray = Array.isArray || function (obj) {
		return "[object Array]" == toString.call(obj);
	};

	vindication.required = function ( object, cvalue ) {
		return !cvalue || object;
	};
	vindication.notblank = function ( object, cvalue ) {
		return vindication.isString( object ) && '' !== object.replace( /^\s+/g, '' ).replace( /\s+$/g, '' );
	};
	vindication.minlength = function ( object, cvalue ) {
		return object.length >= cvalue;
	};
	vindication.maxlength = function ( object, cvalue ) {
		return object.length <= cvalue;
	};
	vindication.rangelength = function ( object, cvalue ) {
		return vindication.minlength( object, cvalue[ 0 ] ) && vindication.maxlength( object, cvalue[ 1 ] );
	};
	vindication.min = function ( object, cvalue ) {
		return Number( object ) >= cvalue;
	};
	vindication.max = function ( object, cvalue ) {
		return Number( object ) <= cvalue;
	};
	vindication.range = function ( object, cvalue ) {
		return object >= cvalue[ 0 ] && object <= cvalue[ 1 ];
	};
	vindication.regexp = function ( object, cvalue ) {
		return new RegExp( cvalue ).test( object );
	};
	vindication.equalto = function ( object, cvalue ) {
		return object === cvalue;
	};
	vindication.mincheck = function ( object, cvalue ) {
		return vindication.minlength( object, cvalue );
	};
	vindication.maxcheck = function ( object, cvalue ) {
		return vindication.maxlength( object, cvalue );
	};
	vindication.rangecheck = function ( object, cvalue ) {
		return vindication.rangelength( object, cvalue );
	};
	vindication.type = function ( object, cvalue ) {
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

	vindication.checkConstraints = function( model, objectFunc, constraints ) {
		var object = objectFunc();
		for (var key in constraints){
			if( key !== 'message' ){
				var constraint = constraints[key];
				if( constraint.params && constraint.condition ){
					if( constraint.condition(model) ){
						var cresp = vindication[ key ](object, constraint.params) ? null : (constraints['message'] || 'This value seems to be invalid:') + ' ' + object;
						if( cresp )
							return cresp;
					}
				}
				else{
					var resp = vindication[ key ](object, constraint) ? null : (constraints['message'] || 'This value seems to be invalid:') + ' ' + object;
					if( resp )
						return resp;
				}
			}
		}
	};


	vindication.validate = function (obj, rules, context) {
		var self = context || this;
		return function( data, validationRules ){

			function functify( object ) {
				var res = object;
				if ( vindication.isString(object) || vindication.isDate(object) || vindication.isNumber(object) || vindication.isFunction(object) ){
					res = function(){ return object; };
				}
				else if ( vindication.isArray(object) ){
					res = [];
					for (var index in object)
						res.push( functify( object[index] ) );
				}
				else if ( vindication.isObject(object) ){
					res = {};
					for (var key in object)
						res[key] = functify( object[key] );
				}
				return res;
			}

			function walk( model, object, constraints ) {
				var res;
				if ( vindication.isFunction(object) ){
					if(constraints)
						return vindication.checkConstraints( model, object, constraints );
				}
				else if ( vindication.isArray(object) ){
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
				else if ( vindication.isObject(object) ){
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

			var model = functify(data);

			return walk( model, model, validationRules );
		}( obj, rules );
	};

}).call(this);