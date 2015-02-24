import Validator from 'furnace-validation/object';
import Ember from 'ember';
export default Validator.extend({
	
	_validators: null,
	
	validators: Ember.computed(function(index,value) {
		if(value) {
			var validators = Ember.A();
			var self = this;
			for(var name in value) {
				var options = value[name];
				if(options===true) {
					options=null;
				}
				validators.pushObject(this.validatorFor(name,options));
			}
			return validators;		
		}
		else {
			return this.get('_validators');
		}
	}),
	
	_validate : function(context) {
		var promises=Ember.A();
		var validator=this;
		if(context.value) {
			Ember.assert('The enum validator received a value that is not enumerable!',Ember.Enumerable.detect(context.value));
			var validators=validator.get('validators');				
			context.value.forEach(function(item,index) {
				var nestedContext=validator._nestContext(context,index,item);
				if(nestedContext) {
					promises.pushObjects(validators.invoke('_validate',nestedContext));
				}
			});
		} 
		return Ember.RSVP.all(promises,validator.constructor.toString()+" All validations for "+context.path).then(function(values) {
			return context.result;
		},function(e) {
			return e;
		},validator.constructor.toString()+" Validations resolved");	
	},
});
