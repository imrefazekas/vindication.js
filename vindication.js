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

	vindication.VERSION = "1.2.3";

	var toString = Object.prototype.toString;

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

	vindication.isRule = function(obj){
		return obj && vindication.isObject( obj ); // && !vindication.isFunction(obj);
	};

	vindication.requiredFn = function ( object, cvalue ) {
		return !cvalue || object;
	};
	vindication.minlengthFn = function ( object, cvalue ) {
		return object.length >= cvalue;
	};
	vindication.maxlengthFn = function ( object, cvalue ) {
		return object.length <= cvalue;
	};
	vindication.lengthFn = function ( object, cvalue ) {
		return vindication.minlengthFn( object, cvalue[ 0 ] ) && vindication.maxlengthFn( object, cvalue[ 1 ] );
	};
	vindication.minFn = function ( object, cvalue ) {
		return Number( object ) >= cvalue;
	};
	vindication.maxFn = function ( object, cvalue ) {
		return Number( object ) <= cvalue;
	};
	vindication.rangeFn = function ( object, cvalue ) {
		return object >= cvalue[ 0 ] && object <= cvalue[ 1 ];
	};
	vindication.patternFn = function ( object, cvalue ) {
		return new RegExp( cvalue ).test( object );
	};
	vindication.equaltoFn = function ( object, cvalue ) {
		return object === cvalue;
	};
	vindication.mincheckFn = function ( object, cvalue ) {
		return vindication.minlengthFn( object, cvalue );
	};
	vindication.maxcheckFn = function ( object, cvalue ) {
		return vindication.maxlengthFn( object, cvalue );
	};
	vindication.checkFn = function ( object, cvalue ) {
		return vindication.lengthFn( object, cvalue );
	};
	vindication.typeFn = function ( object, cvalue ) {
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
				regExp = Regexp('(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)', 'i');
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
		if( vindication.isFunction( constraints ) ){
			if( !constraints( object ) )
				return 'This value seems to be invalid:' + ' ' + object;
		}
		else for (var key in constraints){
			if( key !== 'message' ){
				var constraint = constraints[key];
				if( constraint.params && constraint.condition ){
					if( constraint.condition(model) ){
						var cresp = vindication[ key + 'Fn' ](object, constraint.params) ? null : (constraints.message || 'This value seems to be invalid:') + ' ' + object;
						if( cresp )
							return cresp;
					}
				}
				else{
					var resp = vindication[ key + 'Fn' ](object, constraint) ? null : (constraints.message || 'This value seems to be invalid:') + ' ' + object;
					if( resp )
						return resp;
				}
			}
		}
	};

	vindication.validate = function (obj, rules, context) {
		var self = context || this;
		return function( data, validationRules ){

			function functify( object, constraints ) {
				var res = object;
				if (
					vindication.isRule(constraints) &&
					(vindication.isString(object) || vindication.isDate(object) || vindication.isNumber(object) || vindication.isFunction(object))
				){
					res = function(){ return object; };
				}
				else if ( vindication.isArray(object) ){
					res = [];
					if( vindication.isRule(constraints) )
						for (var index in object)
							res.push( functify( object[index], constraints ) );
				}
				else if ( vindication.isObject(object) ){
					res = {};
					if( constraints )
						for (var key in object)
							if( vindication.isRule(constraints[key]) )
								res[key] = functify( object[key], constraints[key] );
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

			var model = functify( data, validationRules );

			return walk( model, model, validationRules );
		}( obj, rules );
	};

}).call(this);
