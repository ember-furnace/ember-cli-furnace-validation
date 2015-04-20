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
			if(value==="")
				return;
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
				result.addError(context,'tooShort',[this.get('min')],'delayed');
			}
		}
		if(this.get('max')!==false) {
			if(length>this.max) {
				result.addError(context,'tooLong',[this.get('max')]);
			} else if(length> this.max-this.max/5) {
				result.addNotice(context,'stringLength',[length,this.get('max')],'focus');
			}
		}
		
	},

	checkObject: function(context,value,result) {
		var length=value ? value.length : 0;
		if(length===undefined || length===0) {
			return;
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
			} else if(length> this.max-this.max/5) {
				result.addNotice(context,'objectLength',[length,this.get('max')],'focus');
			}
		}
		
	}
	
});
