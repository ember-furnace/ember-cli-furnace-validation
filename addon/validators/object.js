import Promise from './promise';
import Ember from 'ember';

export default Promise.extend({
	_validators : null,
	
	_observers : null,
	
	typeCheck : null,
	
	validators: Ember.computed(function() {
		var ret = {};
		var self = this;
		this.constructor.eachComputedProperty(function(name, meta) {
			if (meta.type==='validation') {
				ret[name]=self.get(name);
			}
		});
		return ret;
	}).readOnly(),
	
	init: function() {
		this._super();	
		this._validators={};
		this.get('validators');
	},
	
	_validate: function(context) {		
		var promises=Ember.A();
		Ember.assert('The object validator can\'t validate enumerables',!Ember.Enumerable.detect(context.value));
		
		// Check the stack for circular checks
		if(!context.stack.contains(context.value)) {
			context.stack.push(context.value);
			var validators=this.get('validators');
			for(var propertyName in validators) {
				var nestedContext=context.nest(propertyName);
				if(nestedContext) {
					promises.pushObject(validators[propertyName]._validate(nestedContext));
				}
			}
			promises.pushObject(this._super(context));
		}
		
		var validator=this;
		return Ember.RSVP.all(promises,validator.constructor.toString()+" All validations for "+context.path).then(function(values) {
			return context.result;
		},function(e) {
			return e;
		},validator.constructor.toString()+" Validations resolved");		
	},
	
	_validateProperty:function(propertyName,context) {
		return this.get('validators.'+propertyName).invoke('_validate',context);
	},
	
		
	_observe : function(observer) {
//		console.log('Validator _observer');
//		Ember.debug(this);
		this._super(observer);
		var validators=this.get('validators');
		for(var propertyName in validators) {
			observer._observe(propertyName,validators[propertyName]);
		}
	},
	
	call : function(context,value,result) {
		if(value){
			if(!(value instanceof Ember.Object)) {
				result.addError(context,'notObject');
			} else if(this.get('typeCheck') && !(value instanceof this.get('typeCheck'))) {
				result.addError(context,'invalidType');
			}
		}
	},

});
