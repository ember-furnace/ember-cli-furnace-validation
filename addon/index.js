/**
 * Provides validation features.
 *
 * @module furnace-validaton
 * @class Furnace.Validation
 * @static
 */

import ObjectValidator from './validators/object';
import StateValidator from './validators/state';
import PropertyValidator from './validators/property';
import PromiseValidator from './validators/promise';
import EnumValidator from './validators/enum';
import CollectionValidator from './validators/collection';
import Ember from 'ember';

/**
 * Normalize validator and options arguments 
 * @private
 */
var getValidators=function(validators,options) {	
	if(typeof validators === 'string') {
		var name=validators;
		validators={};
		if(!options)
			options=true;
		validators[name]=options;
	}
	else {
		Ember.assert("You should either pass the name of a single validator or a hash with validator:options",typeof validators==='object');
		Ember.assert("When passing multiple validators, options should be in the validators hash",!options);
	}
	return validators;
};

/**
 * Get meta for computed properties
 * @private
 */
var getMeta=function(validators,type) {
	type=type || 'validation';
	return {
		type: type,
		validators:validators
	};
};

/**
 * Get computed properties
 * @private
 */
var getComputed=function() {
	return Ember.computed(function(key) {
		Ember.assert("You have an assigned attribute validation to something thats not an ObjectValidator",(this instanceof ObjectValidator || this instanceof StateValidator));
		
		if(!this._validators[key]) {
			this._validators[key]=CollectionValidator.create();
			var meta = this.constructor.metaForProperty(key);
			var validators=meta.validators;
			for(var validator in validators) {
				var options=validators[validator];
				if(options) {
					if(options===true) {
						// It was indicated just to append this validator without any options.
						// By passing null we can get a cached instance.
						options=null;
					}						
				}
				var _validator;
				switch(validator) {
					case 'enum':
						_validator=EnumValidator.create({validators : options});
						break;
					case 'state':
						_validator=StateValidator.extend(options).create({container: this.get('container')});
						break;
					case 'object':
						_validator=ObjectValidator.extend(options).create({container: this.get('container')});
						break;
					default:
						_validator=this.validatorFor(validator,options);
						break;
				}
				this._validators[key].push(_validator);
				
			}
		}			
		return this._validators[key];
	});
};

export default {
	
	/**
	 * PropertyValidator
	 * @property Property
	 * @type Furnace.Validation.PropertyValidator
	 * @for Furnace.Validation
	 * @static
	 */
	Property: PropertyValidator,
	
	/**
	 * ObjectValidator
	 * @property Object
	 * @type Furnace.Validation.ObjectValidator
	 * @for Furnace.Validation
	 * @static
	 */
	Object: ObjectValidator,
	
	/**
	 * StateValidator
	 * @property State
	 * @type Furnace.Validation.StateValidator
	 * @for Furnace.Validation
	 * @static
	 */
	State: StateValidator,
	
	/**
	 * PromiseValidator
	 * @property Promise
	 * @type Furnace.Validation.PromiseValidator
	 * @static
	 */
	Promise: PromiseValidator,
	
	/**
	 * Add validation to an enumerable property.
	 * 
	 * Validations apply to the property itself. Chain with another "val()" to add validation for the enumerable contents
	 * 
	 * @method enum
	 * @static
	 * @for Furnace.Validation
	 * @param validators {Object} Either the name of the validator with options in the 2nd parameter or a hash with validator:options as key:value pairs
	 * @param options (optional} {Object} Options for a single validator 
	 * @return Ember.ComputedProperty 
	 */
	enum : function(validators,options) {
		var listValidators={};
		if(validators) {
			listValidators=getValidators(validators,options);
		}
		var meta = getMeta(listValidators);
		
		var list = getComputed().meta(meta);
		list.val = function(validators,options) {
			var itemValidators=this._meta.validators || {};
			itemValidators['enum']=getValidators(validators,options);
			var meta = getMeta(itemValidators);
			return this.meta(meta);
		};
		return list;
	},
	
	/**
	 * Extend and add object validator
	 * 
	 * @method object
	 * @static
	 * @for Furnace.Validation
	 * @param options {Object} ObjectValidator options
	 * @return Ember.ComputedProperty 
	 */
	object: function(options) {
		 return this.val('object' ,options);
	},
	
	/**
	 * Extend and add state validator
	 * 
	 * @method state
	 * @static
	 * @for Furnace.Validation
	 * @param fn {Function} Method for determining object state
	 * @param deps {Object} Dependend key names
	 * @param states {Object} Hash with states and their associated validations
	 * @return Ember.ComputedProperty 
	 */
	state: function(fn,deps,states) {		
		states=states || {};
		states._stateFn=fn;
		states._stateDeps=deps;
		return this.val('state' ,states);
	},
	
	/**
	 * Add one or more validators
	 * 
	 * @method val
	 * @static
	 * @for Furnace.Validation
	 * @param validators {Object} Either the name of the validator with options in the 2nd parameter or a hash with validator:options as key:value pairs
	 * @param options (optional} {Object} Options for a single validator 
	 * @return Ember.ComputedProperty 
	 */
	val : function(validators,options) {
		validators=getValidators(validators,options);
		
		var meta = getMeta(validators);
		return getComputed().meta(meta).readOnly();
	}
};
