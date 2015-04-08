import Ember from 'ember';
import Validator from 'furnace-validation/validators/property';

export default Validator.extend({
	min: false,
	max: false,
	exact : false,
	
	call : function(context,value,result) {		
		switch(typeof value) {
		
		case 'undefined':			
			return;
		case 'number':
			value=value.toString();
		case 'string':	
			this.checkString(context,value,result);
			break;		
		case 'object':	
			if(value===null) { 
				return;
			}
			this.checkObject(context,value,result);
			break;
		default:
			Ember.assert("Can not determine length of "+typeof value);
		}
		
	},

	checkString: function(context,value,result) {
		var length=value.length;
		if(this.get('exact')!==false) {
			if(length!==this.exact) {
				result.addError(context,'wrongLength',[this.get('exact')]);
			}
		}
		if(this.get('min')!==false) {
			if(length<this.min) {
				result.addError(context,'tooShort',[this.get('min')]);
			}
		}
		if(this.get('max')!==false) {
			if(length>this.max) {
				result.addError(context,'tooLong',[this.get('max')]);
			}
		}
		
	},

	checkObject: function(context,value,result) {
		var length=value ? value.length : 0;
		if(length===undefined) {
			length=0;
		}
		if(this.get('exact')!==false) {
			if(length!==this.exact) {
				result.addError(context,'wrongLength',[this.get('exact')]);
			}
		}
		if(this.get('min')!==false) {
			if(length<this.min) {
				result.addError(context,'tooShort',[this.get('min')]);
			}
		}
		if(this.get('max')!==false) {
			if(length>this.max) {
				result.addError(context,'tooLong',[this.get('max')]);
			}
		}
		
	}
	
});
