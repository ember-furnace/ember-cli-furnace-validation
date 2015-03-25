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
	 * Initialize result
	 * @method init
	 * @protected
	 */
	init : function() {
		this.set('_messages', {});		
	},
	
	
	setValid:function() {
		this.set('valid',true);
		return this;
	},
	
	setInvalid:function() {
		this.set('valid',false);
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
					}
				}
				
			}
			else {
				this._messages[context.path]=Ember.A();
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
		return this.getErrors(key).length;
	},
	
	getWarningCount:function(key) {
		return this.getWarnings(key).length;
	},
	
	getNoticeCount:function(key) {
		return this.getNotices(key).length;
	}
});