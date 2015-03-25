import Ember from 'ember';
import Message from './message';
export default Ember.Object.extend({
	
	valid:false,
	
	messages: Ember.computed.readOnly('_messages'),
	
	_validations: null,
	
	_messages: null,
	
	_valCount: 0,
	
	_valCountIncrease : function() {
		this._valCount++;
	},
	
	_valCountDecrease : function() {
		this._valCount--;
		if(this._valCount===0) {
			if(this.getErrorCount()===0) {
				this.set('valid',true);
			} else {
				this.set('valid',false);
			}
		}
	},
	
	init : function() {
		this.set('_messages', {});		
		this.set('_validations', {});
	},
	
	updateValidity: function(context,deep) {
		if(deep) {
			for(var path in this._validations) {
				if(path.substr(0,context.path.length)===context.path) {
					this._validations[path]=this.getErrorCount(path)===0;
				}
			}
			
		}		
		if(!this.getErrorCount(context.path)){
			this.setValid(context);
		}
	},
	
	setValidation:function(context,valid) {
		if(valid===undefined)
			valid=false;
		this._validations[context.path]=valid;
	},
	
	setValid:function(context) {
		if(context) {
			this._validations[context.path]=true;
		} else {
			this.set('valid',true);
		}
		return this;
	},
	
	setInvalid:function(context) {
		if(context) {
			this._validations[context.path]=false;
		} else {
			this.set('valid',false);
		}
		return this;
	},
	
	isValid:function() {
		return this.get('valid');
	},
	
	reset:function(context,deep) {		
		if(context) {
			if(deep) {
				for(var path in this._messages) {
					if(path.substr(0,context.path.length)===context.path) {
						this._messages[path]=Ember.A();
						this._validations[path]=false;
					}
				}
				
			}
			else {
				this._messages[context.path]=Ember.A();
				this._validations[context.path]=false;
			}
		} else {
			this.set('_messages', {});		
		}
	},
	
	addError:function(context,message,attributes) {
		this.setInvalid();
		this.addMessage(context,message,'error',attributes);
		return this;
	},
	
	addWarning:function(context,message,attributes) {
		this.setInvalid();
		this.addMessage(context,message,'warning',attributes);
		return this;
	},
	
	addNotice:function(context,message,attributes) {
		this.setInvalid();
		this.addMessage(context,message,'notice',attributes);
		return this;
	},
	
	addMessage:function(context,message,type,attributes) {
		if(!this._messages[context.path]) {
			this._messages[context.path]=Ember.A();
		}
		this._messages[context.path].push(Message.create({
				message: message,
				key: context.key,
				path: context.path,
				name: context.name,
				type:type,
				attributes:attributes
			}));
		return this;
	},
		
	getAll:function() {
		var ret=Ember.A();
		for(var key in this._messages) {
			ret.pushObjects(this._messages[key]);
		}
		return ret;
	},
	
	getKeys: function() {
		var ret=Ember.A();
		for(var key in this._messages) {
			ret.pushObject(key);
		}
		return ret;
	},
	
	getKey:function(key) {
		if(!this._messages[key]) {
			return null;
		}
		return this._messages[key];
	},
	
	getValidations:function() {
		var validations={};
		for(var path in this._validations) {
			validations[path]=this._validations[path];
		}
		return validations;
	},
	
	getMessages:function(key,type) {
		var messages;
		if(key) {
			messages=this.getKey(key);
		} else {
			messages=this.getAll();
		}
		if(type && messages) {
			return messages.filterBy('type',type);
		}
		return messages;
	},
	
	getErrors:function(key) {
		return this.getMessages(key,'error');
	},
	
	getWarnings:function(key) {
		return this.getMessages(key,'warning');
	},
	
	getNotices:function(key) {
		return this.getMessages(key,'notice');
	},
	
	getErrorCount:function(key) {
		var messages=this.getErrors(key);
		if(messages===null) {
			return 0;
		}
		return messages.length;
	},
	
	getWarningCount:function(key) {
		var messages=this.getWarnings(key);
		if(messages===null) {
			return 0;
		}
		return messages.length;
	},
	
	getNoticeCount:function(key) {
		var messages=this.getNotices(key);
		if(messages===null) {
			return 0;
		}
		return messages.length;
	}
});