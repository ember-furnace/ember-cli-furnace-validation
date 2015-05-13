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
import CollectionValidator from './validators/collection';
import EnumValidator from './validators/enum';
import EnumItemValidator from './validators/enum-item';
import Ember from 'ember';

import getOptions from './utils/get-options';
import getValidator from './utils/get-validator';

/**
 * Get meta for computed properties
 * @private
 */
var getMeta=function(validators,collection) {
	collection=collection || CollectionValidator;
	return {
		type: 'validation',
		collection: collection,
		validators:validators
	};
};

/**
 * Get computed properties
 * @private
 */
var getComputed=function(enumerable) {
	return Ember.computed(function(key) {
		Ember.assert("You have an assigned attribute validation to something thats not an ObjectValidator",(this instanceof ObjectValidator || this instanceof StateValidator));
		
		if(!this._validators[key]) {			
			var meta = this.constructor.metaForProperty(key);
			if(meta.type==='validation') {
				this._validators[key]=meta.collection.create();
				
				var validators=meta.validators;
				for(var validator in validators) {					
					this._validators[key].push(getValidator.call(this,validator,validators[validator]));
					
				}
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
	 * CollectionValidator
	 * @property Object
	 * @type Furnace.Validation.CollectionValidator
	 * @for Furnace.Validation
	 * @static
	 */
	Collection: CollectionValidator,
	
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
			listValidators=getOptions(validators,options);
		}
		var meta = getMeta(listValidators,EnumValidator);
		
		var list = getComputed(true).meta(meta);
		list.val = function(validators,options) {
			var itemValidators=this._meta.validators || {};
			itemValidators['enum']=getOptions(validators,options);
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
	 * Extend and add a collection validator
	 * 
	 * @method collection
	 * @static
	 * @for Furnace.Validation
	 * @param options {Object} CollectionValidator validator collection
	 * @return Ember.ComputedProperty 
	 */
	collection : function(options) {
		return this.val('collection' ,options);
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
		validators=getOptions(validators,options);
		
		var meta = getMeta(validators);
		return getComputed().meta(meta).readOnly();
	}
};
