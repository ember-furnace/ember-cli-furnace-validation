import Ember from 'ember';
import Message from './message';

/**
 * Validation result
 * 
 * @namespace Furnace.Validation
 * @class Result
 */
export default Ember.Object.extend({
	/**
	 * Result of the validation
	 * 
	 * @property valid
	 * @type Boolean
	 * @default false
	 */
	valid:false,
	
	/**
	 * Messages emitted by the validator(s)
	 * 
	 * @property messages
	 * @type Array 
	 * @readOnly
	 */
	messages: Ember.computed.readOnly('_messages'),
	
	/**
	 * Messages emitted by the validator(s)
	 * 
	 * @property _messages
	 * @type Array 
	 * @private
	 */
	_messages: null,
	
	/**
	 * Valid state for properties that were validated by the validator(s)
	 * 
	 * @property validations
	 * @type Object 
	 * @readOnly
	 */
	validations: Ember.computed.readOnly('_validations'),
	
	/**
	 * Valid state for properties that were validated by the validator(s)
	 * 
	 * @property validations
	 * @type Object 
	 * @private
	 */
	_validations: null,
	
	/**
	 * Running validators refcounter
	 * 
	 * @property _valCount
	 * @type int 
	 * @private
	 */
	_valCount: 0,
	
	/**
	 * Increase validator refcount
	 * @method _valCountIncrease
	 * @private
	 */
	_valCountIncrease : function() {
		this._valCount++;
	},
	
	/**
	 * Decrease validator refcount
	 * @method _valCountDecrease
	 * @private
	 */
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
	
	/**
	 * Indicates if there are no validators running for this result object 
	 * @method hasFinished
	 * @return {Boolean} True if there are no validators running
	 */
	hasFinished: function() {
		return this._valCount===0;
	},
	
	/**
	 * Initialize result
	 * @method init
	 * @protected
	 */
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
		this._validations[context.path]=this.getErrorCount(context.path)===0;
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
				for(var path in this._validations) {
					if(path.substr(0,context.path.length)===context.path) {
						if(this._messages[path]!==undefined) {
							delete this._messages[path];
						}
						delete this._validations[path];
					}
				}
				
			}
			else {
				delete this._messages[context.path];
				delete this._validations[context.path];
			}
		} else {
			this.set('_validations', {});
			this.set('_messages', {});		
		}
	},
	
	addError:function(context,message,attributes,display) {
		this.setInvalid();
		this.addMessage(context,message,'error',attributes,display);
		return this;
	},
	
	addWarning:function(context,message,attributes,display) {
		this.setInvalid();
		this.addMessage(context,message,'warning',attributes,display);
		return this;
	},
	
	addNotice:function(context,message,attributes,display) {
		this.setInvalid();
		this.addMessage(context,message,'notice',attributes,display);
		return this;
	},
	
	addMessage:function(context,message,type,attributes,display) {
		if(!this._messages[context.path]) {
			this._messages[context.path]=Ember.A();
		}
		if(message.indexOf('.')===-1) {
			message='validation.'+type+'.'+message;
		}
		this._messages[context.path].push(Message.create({
				message: message,
				key: context.key,
				path: context.path,
				name: context.name,
				type:type,
				attributes:attributes || null,
				display: display || 'immediate'
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