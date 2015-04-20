import Validator from 'furnace-validation/validators/property';
import Ember from 'ember';
export default Validator.extend({
	call : function(context,value,result) {
		if(Ember.isBlank(value) || value===false) {			
			result.addError(context,'blank',null,'blur');
		}
	}
});
