import Ember from 'ember';
import Message from './message';
export default Ember.Object.extend({
	
	_valid:true,
	
	_messages: null,
	
	_errors: 0,
	
	_warnings: 0,
	
	_notices: 0,
	
	init : function() {
		this.set('_messages', {});		
	},
	
	setValid:function() {
		this.set('_valid',true);
		return this;
	},
	
	setInvalid:function() {
		this.set('_valid',false);
		return this;
	},
	
	isValid:function() {
		return this.get('_valid');
	},
	
	addError:function(context,message,attributes) {
		this.setInvalid();
		this.addMessage(context,message,'error',attributes);
		this._errors++;
		return this;
	},
	
	addWarning:function(context,message,attributes) {
		this.setInvalid();
		this.addMessage(context,message,'warning',attributes);
		this._warnings++;
		return this;
	},
	
	addNotice:function(context,message,attributes) {
		this.setInvalid();
		this.addMessage(context,message,'notice',attributes);
		this._notices++;
		return this;
	},
	
	addMessage:function(context,message,type,attributes) {		
		if(!this._messages[context.path]) {
			this._messages[context.path]=Ember.A();
		}
		this._messages[context.path].push(Message.create({
				message: message,
				key: context.key,
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
	
	getKey:function(key) {
		if(!this._messages[key]) {
			return null;
		}
		return this._messages[key];
	},
	
	getMessages:function(key,type) {
		var messages;
		if(key) {
			messages=this.getKey(key);
		} else {
			messages=this.getAll();
		}
		if(type) {
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
		if(key) {
			return this.getErrors(key).length;
		}
		return this._errors;
	},
	
	getWarningCount:function(key) {
		if(key){
			return this.getWarnings(key).length;
		}
		return this._warnings;
	},
	
	getNoticeCount:function(key) {
		if(key){
			return this.getNotices(key).length;
		}
		return this._notices;
	}
});