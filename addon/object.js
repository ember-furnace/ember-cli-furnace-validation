import Validator from './validator';
import Ember from 'ember';
import Lookup from './utils/lookup';

export default Validator.extend({
	_validators : null,
	
	typeCheck : null,
	
	validators: Ember.computed(function() {
		var ret = {};
		var self = this;
		this.constructor.eachComputedProperty(function(name, meta) {
			if (meta.type==='validator') {
				ret[name]=self.get(name);
			}
		});
		return ret;
	}).readOnly(),
	
	init: function() {
		this._super();	
		this._validators=Ember.A();
	},
	
	_validate: function(context) {		
		var promises=Ember.A();
		
		Ember.debug(this);
		Ember.debug(context.value);
		console.log(context);
		
		var validators=this.get('validators');
		for(var propertyName in validators) {
			var nestedContext=this._nestContext(context,propertyName);
			if(nestedContext) {
				promises.pushObjects(validators[propertyName].invoke('_validate',nestedContext));
			}
		}
		
		if(!context.stack.contains(context.value)) {
			context.stack.push(context.value);
			promises.pushObject(this._super(context));
		}
		
		var validator=this;
		return Ember.RSVP.all(promises,validator.constructor.toString()+" All validations").then(function(values) {
			return context.result;
		},function(e) {
			return e;
		},validator.constructor.toString()+" Validations resolved");		
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
