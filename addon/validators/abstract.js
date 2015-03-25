import Ember from 'ember';
import Lookup from '../utils/lookup';
import Result from '../result';
import Observer from '../observer';
import createContext from '../utils/context';

/**
 * Base validation class
 * 
 * @namespace Furnace.Validation
 * @extends Ember.Object
 * @class Abstract
 */
export default Ember.Object.extend({
	
	/**
	 * Run validation 
	 * 
	 * @method validate
	 * @param value {Mixed} Value to be validated
	 * @param key (optional) {String} Key/name of the validated value
	 * @param result (optional) {Furnace.Validation.Result} Instance of a result object 
	 * @return {Furnace.Validation.Result|Ember.RSVP.Promise} Returns validation result object or promise
	 */
	validate : function(value,key,result) {
		Ember.assert('Result to append to should be an instance of Result',!result || (result instanceof Result));
		var context=createContext(value,key,result);
		return this._validate(context);
	},
		
	/**
	 * Run validation based upon context
	 * 
	 * @method _validate
	 * @protected
	 * @param context {Object} Validation context
	 * @return {Furnace.Validation.Result|Ember.RSVP.Promise} Returns validation result object or promise
	 */
	_validate : function(context) {
		context.result._valCountIncrease();
		this.call(context,context.value,context.result);
		context.result._valCountDecrease();
		return context.result;
	},
	
	/**
	 * Actual validation logic
	 * 
	 * @method call
	 * @abstract
	 * @param context {Object} Validation context
	 * @param value {Mixed} Validation context
	 * @param result {Furnace.Validation.Result} Validation result object instance
	 */
	call : function(context,value,result) {
		Ember.assert("Did you forget to override the 'call' method in your validator? ("+this.toString()+")");
	},
	
	validatorFor : Lookup,
	
	/**
	 * Observe object to automatically validate a object on (value) changes 
	 * 
	 * @method observe
	 * @param target {Ember.Object} Object to observe
	 * @param key {String} Object attribute to observe
	 * @param callback {Function} function to run on validation update
	 * @param name (optional) {String} An optional name to use when populating validation messages
	 * @return {Furnace.Validation.Observer} Observer object 
	 */
	observe : function(target,key,callback,name) {		
		return Observer.create({
			_validator : this,
			_target : target,
			_key : key,
			_callback : callback,
			_name : name
		});
		
	},
	
	_observe : function(observer) {
		
	}
});