import Ember from 'ember';
import Promise from './promise';

/**
 * Collection of validators, wrapping different validators into one promise
 * 
 * @namespace Furnace.Validation
 * @class Collection
 * @extends Furnace.Validation.Promise
 */
export default Promise.extend({
	
	/**
	 * Validator instances
	 * @property _validators
	 * @protected 
	 */
	_validators : null,
	
	/**
	 * Validator initialization
	 * @method init
	 * @protected
	 */
	init : function() {
		this._validators=Ember.A();
	},
	
	/**
	 * Add validator to the collection
	 * @method push
	 * @param validator {Abstract} validator to add
	 */
	push : function(validator) {
		this._validators.push(validator);
	},

	_validate : function(context) {
		var validator=this;
		context.result._valCountIncrease();
		var promises=Ember.A();
		promises.pushObjects(this._validators.invoke('_validate',context));
		
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
		this._validators.forEach(function(validator) {
			validator._observe(observer);
		});
	}
	
});