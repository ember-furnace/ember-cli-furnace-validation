import Ember from 'ember';
import Collection from './collection';

/**
 * Enumerable validator
 * 
 * @namespace Furnace.Validation
 * @class Enum
 * @extends Furnace.Validation.Object
 */
export default Collection.extend({
	
	_validate : function(context,paths) {
		var promises=Ember.A();
		promises.push(this._super(...arguments));
		var validator=this;
		if(context.value) {
			Ember.assert('The enum validator received a value that is not enumerable!',Ember.Enumerable.detect(context.value));
			var itemValidator=this._itemValidator;
			if(itemValidator) {
				context.value.forEach(function(item,index) {
					var nestedContext=context.nest(index,item);
					if(nestedContext) {
						promises.pushObject(itemValidator._validate(nestedContext,paths));
					}
				});
			}
		} 
		return Ember.RSVP.all(promises,validator.constructor.toString()+" All validations for "+context.path).then(function() {			
			return context.result;
		},function(e) {
			Ember.Logger.error('Exception during validation in '+validator.constructor.toString()+': '+e);
			context.result.addError(context,'validation.error.exception');
			return context.result;
		},validator.constructor.toString()+" Validations resolved");	
	},
	
	_observe : function(observer) {
		this._super(observer);
		if(observer._getValue() && typeof observer._getValue()==='object') {
			observer._observeKey('@each');
			if(this._itemValidator) {
				observer._observe('@each',this._itemValidator);
			}
		}
	},
	
	
});
