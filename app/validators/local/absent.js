import Validator from 'furnace-validation/validators/property';
import Ember from 'ember';
export default Validator.extend({
	
	messages : {present : 'present'},
	
	call : function(context,value,result) {			
		if(!Ember.isEmpty(value)) {
			result.addError(context,this.messages.present);
		}
	}
});
