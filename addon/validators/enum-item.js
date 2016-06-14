import Promise from './promise';
import Ember from 'ember';
import CollectionValidator from './collection';
/**
 * Enumerable validator
 * 
 * @namespace Furnace.Validation
 * @class Enum
 * @extends Furnace.Validation.Object
 */
export default Promise.extend({
	
	_validators: null,
	
	validator: Ember.computed(function() {
		var ret = CollectionValidator.create({
			container:this.container
		});
		for(var name in this._validators) {
			var options=this._validators[name]===true ? null : this._validators[name];
			ret.push(this.validatorFor(name,options));				
		}
		return ret;			
	}),
	
	_validate : function(context) {
		var promises=Ember.A();
		var validator=this;
		if(context.value) {			
			Ember.assert('The enum validator received a value that is not enumerable!',Ember.Enumerable.detect(context.value));
			var list=this.get('validator');
			context.value.forEach(function(item,index) {
				var nestedContext=context.nest(index,item);
				if(nestedContext) {
					promises.pushObject(list._validate(nestedContext));
				}
			});
		} 
		return Ember.RSVP.all(promises,validator.constructor.toString()+" All validations for "+context.path).then(function() {
			return context.result;
		},function(e) {
			return e;
		},validator.constructor.toString()+" Validations resolved");	
	},
	
	_observe : function(observer) {
		this._super(observer);
		observer._observe('@each',this.get('validator'));
		
//		var value=observer._getValue();
//		if(value) {
//			Ember.assert('The enum validator received a value that is not enumerable!',Ember.Enumerable.detect(value));
//			var validator=this.get('validator');
//			value.forEach(function(item,index) {
//				console.log(observer);
//			});
//		}
//		console.log(value.get('length'));
//		this.get('validators').forEach(function(validator) {			
//			validator._observe(observer);
//		});
	}
});
