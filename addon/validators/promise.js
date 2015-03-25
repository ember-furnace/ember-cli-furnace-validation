import Abstract from './abstract';
import Ember from 'ember';

/**
 * Promise validator
 * 
 * @namespace Furnace.Validation
 * @extends Furnace.Validation.Abstract
 * @class Promise
 */
export default Abstract.extend({
	_validate : function(context) {
		var validator=this;
		context.result._valCountIncrease();
		return new Ember.RSVP.Promise(function(resolve,reject) {
			try{
				validator.call(context,context.value,context.result);
				resolve(context.result);
			}
			catch(e) {
				reject(e);
			}
		},validator.constructor.toString()+" Validating "+context.path).finally(function(){
			context.result._valCountDecrease();
		});	
	}
});