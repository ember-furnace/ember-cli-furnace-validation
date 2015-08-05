import Ember from 'ember';
import Promise from './promise';
import Validation from '../index';
import getOptions from '../utils/get-options';
import Abstract from './abstract';
/**
 * Collection of validators, wrapping different validators into one promise
 * 
 * @namespace Furnace.Validation
 * @class Collection
 * @extends Furnace.Validation.Promise
 */
export default Promise.extend({
	
	/**
	 * Static validation definition
	 * @property _validators
	 * @protected 
	 */
	_validators : {},
	
	/**
	 * Validator instances
	 * @property _validatorArray
	 * @protected 
	 */
	_validatorArray : null,
	
	/**
	 * Validator initialization
	 * @method init
	 * @protected
	 */
	init : function() {
		this._validatorArray=Ember.A();
		for(var validator in this._validators) {
			this._validatorArray.pushObject(this._getValidator.call(this,validator,this._validators[validator]));
		}
	},
	
	/**
	 * Validators inside the collection
	 * @property validators
	 * @default {Array}
	 * @readOnly
	 */
	validators: Ember.computed.alias('_validatorArray').readOnly(),
	
	/**
	 * Add validator to the collection
	 * @method push
	 * @param validator {Abstract} validator to add
	 */
	push : function(validator) {
		this._validatorArray.pushObject(validator);
	},
	
	pushObject : function(validator) {
		this._validatorArray.pushObject(validator);
	},
	
//	unknownProperty: function(key) {
//		var validators=this.get('validators');
//		var ret = Ember.A();
//		validators.forEach(function(validator) {
//			var validator=validator.get(key);
//			if(validator instanceof Abstract) {
//				ret.pushObject(validator);
//			}
//		});
//		if(ret.length) {
//			ret= Ember.Object.extend(Proxy).create({_validators:ret});
//			return ret;
//		}		
//		return undefined;
//	},
	
	getLength : function() {
		return this._validatorArray.length;
	},

	_validate : function(context,paths) {
		var validator=this;
		context.result._valCountIncrease();
		var promises=Ember.A();
		promises.pushObjects(this.get('validators').invoke('_validate',context,paths));
		
		return Ember.RSVP.all(promises,validator.constructor.toString()+" All validations for "+context.path).then(function(values) {
			return context.result;
		},function(e) {
			return e;
		},validator.constructor.toString()+" Validations resolved").finally(function(){
			context.result._valCountDecrease();
		});	
		
	},
	
	_observe : function(observer) {
		this._super(observer);
		var parent=this;
		this.get('validators').forEach(function(validator) {
			validator._observe(observer);
		});
	}
	
}).reopenClass({
	/**
	 * Add one or more validators to the collection
	 * 
	 * @method val
	 * @static
	 * @for Furnace.Validation.Collection
	 * @param validators {Object} Either the name of the validator with options in the 2nd parameter or a hash with validator:options as key:value pairs
	 * @param options (optional} {Object} Options for a single validator 
	 * @return Furnace.Validation.Collection
	 */
	val : function(validators,options) {
		validators=getOptions(validators,options);
		
		for(var validator in this.prototype._validators) {
			if(validators[validator]===undefined) {
				validators[validator]=this.prototype._validators[validator];
			}
		}
		return this.reopen({
			_validators : validators
		});
	}
 });