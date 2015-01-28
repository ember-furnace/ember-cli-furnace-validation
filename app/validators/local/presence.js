import Validator from 'furnace-validation/property';
import Ember from 'ember';
export default Validator.extend({
	call : function(value,key,result) {			
		if(Ember.isBlank(value)) {
			result.addError(key,'blank');
		}
	}
});
