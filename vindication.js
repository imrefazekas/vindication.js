var _ = require('lodash');

var Vindication = {
	requiredFn: function( object, cvalue ) {
		return !cvalue || object;
	},
	minlengthFn: function( object, cvalue ) {
		return object && object.length >= cvalue;
	},
	maxlengthFn: function( object, cvalue ) {
		return !object || object.length <= cvalue;
	},
	lengthFn: function( object, cvalue ) {
		if( _.isString(cvalue) ){ cvalue = JSON.parse( cvalue ); }
		return this.minlengthFn( object, cvalue[ 0 ] ) && this.maxlengthFn( object, cvalue[ 1 ] );
	},
	elementFn: function( object, cvalue ) {
		return _.isArray(cvalue) && cvalue.indexOf( object ) !== -1;
	},
	minFn: function( object, cvalue ) {
		return object && Number( object ) >= cvalue;
	},
	maxFn: function( object, cvalue ) {
		return object && Number( object ) <= cvalue;
	},
	rangeFn: function( object, cvalue ) {
		return object && object >= cvalue[ 0 ] && object <= cvalue[ 1 ];
	},
	patternFn: function( object, cvalue ) {
		return new RegExp( cvalue ).test( object );
	},
	equaltoFn: function( object, cvalue ) {
		return object === cvalue;
	},
	notblank: function( object, cvalue ) {
		return !cvalue || this.minlengthFn( object, 1 );
	},
	beforeFn: function( object, cvalue ) {
		return this.maxFn( object.getTime ? object.getTime() : object, cvalue.getTime ? cvalue.getTime() : cvalue );
	},
	afterFn: function( object, cvalue ) {
		return this.minFn( object.getTime ? object.getTime() : object, cvalue.getTime ? cvalue.getTime() : cvalue );
	},
	typeFn: function( object, cvalue ) {
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

		return object ? regExp.test( object ) : false;
	},

	checkConstraints: function( root, object, constraints, context ) {
		var self = this;
		if( _.isFunction( constraints ) ){
			if( !constraints.call( context, object ) )
				return 'This value seems to be invalid:' + ' ' + object;
		}
		else for (var key in constraints){
			if( key !== 'message' ){
				var constraint = constraints[key];
				if( constraint.params && constraint.condition ){
					/*city: { equalto: {
						params: "Monaco", condition: function(viewModel){ return viewModel.address.country() === 'France'; }
					} },*/
					if( constraint.condition( root ) ){
						var cresp = self[ key + 'Fn' ](object, constraint.params) ? null : (constraints.message || 'This value seems to be invalid:') + ' ' + object;
						if( cresp )
							return cresp;
					}
				}
				else{
					var resp = self[ key + 'Fn' ](object, constraint) ? null : (constraints.message || 'This value seems to be invalid:') + ' ' + object;
					if( resp )
						return resp;
				}
			}
		}
	},
	walk: function( root, object, constraints, context ) {
		var self = this, res;
		if ( _.isString( object ) ){
			return self.checkConstraints( root, object, constraints, context );
		}
		else if ( _.isBoolean( object ) ){
			return self.checkConstraints( root, object, constraints, context );
		}
		else if ( _.isNumber( object ) ){
			return self.checkConstraints( root, object, constraints, context );
		}
		else if ( _.isDate( object ) ){
			return self.checkConstraints( root, object, constraints, context );
		}
		else if ( _.isRegExp( object ) ){
			return null;
		}
		else if ( _.isArray( object ) ){
			res = [];
			object.forEach(function(element){
				var result = self.walk( root, element, constraints, context );
				if( result )
					res.push( result );
			});
			return res.length === 0 ? null : res;
		}
		else if ( _.isFunction( object ) ){
			return self.checkConstraints( root, object.call( context ), constraints, context );
		}
		else if ( _.isObject( object ) ){
			if( _.isFunction( constraints ) ){
				return self.checkConstraints( root, object, constraints, context );
			}
			else{
				res = {};
				_.forEach(object, function(n, key){
					if( key && object[key] && constraints[key] ){
						var result = self.walk( root, object[key], constraints[key], context );
						if( result )
							res[key] = result;
					}
				});
				return _.keys(res).length === 0 ? null : res;
			}
		}
	}
};

module.exports = {
	version: '3.0.1',
	validate: function(object, constraints, context) {
		return Vindication.walk( object, object, constraints || {}, context || this );
	},
	validateAll: function(objects, constraints, context) {
		if( !_.isArray( objects ) ) return this.validate( objects, constraints, context );
		var res = [];
		objects.forEach(function(object){
			res.push( Vindication.walk( object, object, constraints || {}, context || this ) );
		});
		return res;
	}
};
