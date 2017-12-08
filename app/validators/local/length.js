import Ember from 'ember';
import Validator from 'furnace-validation/validators/property';

export default Validator.extend({
	
	min: false,
	
	max: false,
	
	exact : false,
	
	messages : {
		
		stringWrongLength : 'stringWrongLength',
		stringTooShort : 'stringTooShort',
		stringTooLong : 'stringTooLong',
		stringLength : 'stringLength',
		
		objectWrongLength : 'objectWrongLength',
		objectTooShort : 'objectTooShort',
		objectTooLong : 'objectTooLong',
		objectLength : 'objectLength',
	},
	
	lengthNotice: true,
	
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
			// If input value is too short, user may be still be working on entry, delay error
			if(length<this.exact) {
				result.addError(context,this.messages.stringWrongLength,[this.get('exact'),length],'delayed');
			} else if(length!==this.exact) {
				result.addError(context,this.messages.stringWrongLength,[this.get('exact'),length]);
			}
		}
		if(this.get('min')!==false) {
			if(length<this.min) {
				result.addError(context,this.messages.stringTooShort,[this.get('min'),length,this.get('min')-length],'delayed');
			}
		}
		if(this.get('max')!==false) {
			if(length>this.max) {
				result.addError(context,this.messages.stringTooLong,[this.get('max'),length,length-this.get('max')]);
			} else if(this.lengthNotice && length> this.max-this.max/5) {
				result.addNotice(context,this.messages.stringLength,[this.get('max'),length,this.get('max')-length],'focus');
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
				result.addError(context,this.messages.objectWrongLength,[this.get('exact'),length]);
			}
		}
		if(this.get('min')!==false) {
			if(length<this.min) {
				result.addError(context,this.messages.objectTooShort,[this.get('min'),length,this.get('min')-length]);
			}
		}
		if(this.get('max')!==false) {
			if(length>this.max) {
				result.addError(context,this.messages.objectTooLong,[this.get('max'),length,length-this.get('max')]);
			} else if(this.lengthNotice && length> this.max-this.max/5) {
				result.addNotice(context,this.messages.objectLength,[this.get('max'),length,this.get('max')-length],'focus');
			}
		}
		
	}
	
});
