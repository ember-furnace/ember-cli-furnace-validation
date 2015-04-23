import Validator from 'furnace-validation/validators/property';
import Ember from 'ember';
export default Validator.extend({
	
	messages : {blank : 'blank' },
	
	call : function(context,value,result) {
		if(Ember.isBlank(value) || value===false) {			
			result.addError(context,this.messages.blank,null,'blur');
		}
	}
});
