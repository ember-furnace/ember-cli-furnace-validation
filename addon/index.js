/**
 * Provides validation features.
 *
 * @module furnace-validaton
 * @class Furnace.Validation
 * @static
 */

import PromiseValidator from './validators/promise';
import PropertyValidator from './validators/property';
import StateValidator from './validators/state';
import ObjectValidator from './validators/object';
import CollectionValidator from './validators/collection';
import EnumValidator from './validators/enum';
import Ember from 'ember';

import getOptions from './utils/get-options';
import getValidator from './utils/get-validator';

/**
 * Get meta for computed properties
 * @private
 */
var getMeta=function(validators,collection) {
	collection=collection || 'collection';
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
var getComputed=function() {
	return Ember.computed(function(key) {
		Ember.assert("You have an assigned attribute validation to something thats not an ObjectValidator",(this instanceof ObjectValidator || this instanceof StateValidator));
		
		if(!this._validators[key]) {			
			var meta = this.constructor.metaForProperty(key);
			if(meta.type==='validation') {
				this._validators[key]=Ember.getOwner(this).factoryFor('validator:'+meta.collection).class.create();
				var validators=meta.validators;
				for(let validator in validators) {
					this._validators[key].push(getValidator.call(this,validator,validators[validator]));
				}
				if(meta.itemValidator) {
					meta=meta.itemValidator;
					this._validators[key]['_itemValidator']=Ember.getOwner(this).factoryFor('validator:'+meta.collection).class.create();
					validators=meta.validators;
					for(let validator in validators) {
						this._validators[key]['_itemValidator'].push(getValidator.call(this,validator,validators[validator]));
					}
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
	
	Enum: EnumValidator,
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
		if(arguments.length) {
			validators=getOptions(validators,options);
		} else {
			validators=[];
		}

		var meta = getMeta(validators,'enum');
		var computed = getComputed().meta(meta).readOnly();
		computed.on=function() {
			Ember.assert('Not implemented');
		};
		computed.val=function() {
			Ember.deprecate('Using the val() helper on an enum is deprecated, please use the item() helper instead',false,{id:'furnace-validation:enum-val-deprecation',until:'0.4.0'});
			return this.item(...arguments);
		};
		computed.item=function(validators,options) {
			validators=getOptions(validators,options);
			this._meta.itemValidator=getMeta(validators);
			return this;
		};
		return computed;
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
		return this.val('state',states);
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
		var computed = getComputed().meta(meta).readOnly();
		computed.on=function() {
			// FIXME: only the collection should have the dependend key and in turn should trigger validation
			for(var validator in this._meta.validators) {
				this._meta.validators[validator]._depKeys=arguments[0];
			}
			return this;
		};
		return computed;
	}
};
