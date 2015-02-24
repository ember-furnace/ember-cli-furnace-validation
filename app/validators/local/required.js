import Validator from 'furnace-validation/validators/property';
import Ember from 'ember';
export default Validator.extend({
	call : function(context,value,result) {		
		if(Ember.isBlank(value)) {			
			result.addError(context,'blank');
		}
	}
});
