import Validator from 'furnace-validation/validators/property';
import Ember from 'ember';
export default Validator.extend({
	
	messages : {blank : 'blank' },
	
	allowFalse : false,
	allowNull : false,
	
	call : function(context,value,result) {
		if((Ember.isBlank(value) && !(this.allowNull===true && value===null)) || (this.allowFalse===false && value===false)) {			
			result.addError(context,this.messages.blank,null,'blur');
		}
	}
});
