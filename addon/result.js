import Ember from 'ember';
import Message from './message';
export default Ember.Object.extend({
	
	valid:true,
	
	messages: {},
	
	
	setValid:function() {
		this.set('valid',true);
		return this;
	},
	
	setInvalid:function() {
		this.set('valid',false);
		return this;
	},
	
	addError:function(key,message) {
		this.setInvalid();
		this.addMessage(key,message,'error');
		return this;
	},
	
	addWarning:function(key,message) {
		this.setInvalid();
		this.addMessage(key,message,'warning');
		return this;
	},
	
	addNotice:function(key,message) {
		this.setInvalid();
		this.addMessage(key,message,'notice');
		return this;
	},
	
	addMessage:function(key,message,type) {
		if(!this.messages[key]) {
			this.messages[key]=Ember.A();
		}
		this.messages[key].push(Message.create({message: message,type:type}))
		return this;
	},
		
	
})