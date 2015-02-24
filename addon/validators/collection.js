import Ember from 'ember';
import Promise from './promise';

export default Promise.extend({
	
	_validators : null,
	
	init : function() {
		this._validators=Ember.A();
	},
	
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