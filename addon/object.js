import Validator from './validator';
import Ember from 'ember';
import Lookup from './utils/lookup';

export default Validator.extend({
	_validators : null,
	
	typeCheck : null,
	
	validators: Ember.computed(function() {
		var ret = Ember.A();
		var self = this;
		this.constructor.eachComputedProperty(function(name, meta) {
			if (meta.type==='validator') {
				ret.pushObjects(self.get(name));
			}
		});
		return ret;
	}).readOnly(),
	
	init: function() {
		this._super();	
		this._validators=Ember.A();
	},
	
	_validate: function(context) {		
		var promises=[];
		var nestedContext=context;
		var propertyName=this.get('propertyName');
		
		Ember.debug(this);
		Ember.debug(context.value);
		console.log(context);
		
	
		
		
		
		if(propertyName) {
			nestedContext=this._nestContext(context,propertyName);	
			
		} else {			
			context.stack.push(context.value);
		}
		
		
		if(nestedContext) {
			// Check for circular reference
			if(!propertyName || !context.stack.contains(nestedContext.value)) {
				promises=this.get('validators').invoke('_validate',nestedContext);
				context.stack.push(nestedContext.value);
			} 
		}
		
		
		promises.push(this._super(context));
		
		var validator=this;
		return Ember.RSVP.all(promises,validator.constructor.toString()+" All validations").then(function(values) {
			return context.result;
		},function(e) {
			return e;
		},validator.constructor.toString()+" Validations resolved");		
	},
	
	call : function(value,key,result) {
		if(value){
			if(!(value instanceof Ember.Object)) {
				result.addError(key,'notObject');
			} else if(this.get('typeCheck') && !(value instanceof this.get('typeCheck'))) {
				result.addError(key,'invalidType');
			}
		}
	},

});
