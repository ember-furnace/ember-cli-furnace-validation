import Validator from 'furnace-validation/validators/property';
import Ember from 'ember';
export default Validator.extend({
	
	messages : {	isNaN : 'isNaN' ,
					notReal : 'notReal',
					isReal : 'isReal',
					tooSmall : 'tooSmall',
					tooLarge : 'tooLarge',
					outOfRange : 'outOfRange'
				},
	
	real: null,
	min : null,
	max : null,
	range : null,
	
	call : function(context,value,result) {
		if(!Ember.isBlank(value) && value!==false) {
			if(value==='-') {
				result.addError(context,this.messages.isNaN,null,'delayed');
			} else if(isNaN(value)) {
				result.addError(context,this.messages.isNaN,null,'immediate');
			} else if(this.real===false && value>0) {
				result.addError(context,this.messages.isReal,null,'immediate');
			} else if(this.real===true && value<0) {
				result.addError(context,this.messages.notReal,null,'immediate');
			} else if(this.range!==null) {
				if(value<this.range[0] || value>this.range[1]) {
					result.addError(context,this.messages.outOfRange,[this.range[0],this.range[1]],'immediate');
				}
			} else if(this.min!==null && value<this.min) {
				result.addError(context,this.messages.tooSmall,[this.min],'immediate');
			} else if(this.max!==null && value>this.max) {
				result.addError(context,this.messages.tooLarge,[this.max],'immediate');
			}
		}
	}
});
