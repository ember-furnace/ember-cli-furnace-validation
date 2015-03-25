import Ember from 'ember';
import createContext from './utils/context';
import Result from './result';

/**
 * Observer for automatic object validation
 * 
 * @namespace Furnace.Validation
 * @class Observer
 */
var Observer = Ember.Object.extend({
	
	_validator : null,
	
	_target : null,
	
	_key : null,
	
	_keys : null,
	
	_callback : null,
	
	_name : null,
	
	_context : null,
	
	_getValue : function() {
		if(!this._target) {
			
		}
		return this._target.get(this._key);
	},
	
	_orgValue : null,
	
	_children : null,
	
	init : function() {
		
		if(!this._result) {
			this._result=Result.create();
		}
		if(!this._context) {
			this._context=createContext(this._getValue(),this._name || this._key, this._result);
		}
		
		this._keys=[];
		this._orgValue=this._getValue();
		this._validator._observe(this);
		this._attach();
	},
	
	_detach:function() {
		this._target.removeObserver(this._key,this,this._fn);
		for(var i=0;i<this._keys.length;i++) {
			this._orgValue().removeObserver(this._keys[i],this,this._fn);
		}
	},
	
	_attach: function() {
		this._target.addObserver(this._key,this,this._fn);
		for(var i=0;i<this._keys.length;i++) {
			this._getValue().addObserver(this._keys[i],this,this._fn);
		}
	},

	_observeKey: function(key) {
		this._keys.push(key);
		this._getValue().addObserver(key,this,this._fn);		
	},
	
	_observe : function(key,validator,keepContext) {
		if(!validator) {
			validator=key;
			key=null;
			keepContext=true;
		}
			
		var observer=null;
		
		var value=this._getValue();
		if(value) {
			if(!keepContext) {	
				observer=Observer.create({
					_validator : validator,
					_target : value,
					_key : key,
					_callback : this._callback,
					_context : keepContext ? this._context : this._context.nest(key)
				});
			}else  {				
				observer=Observer.create({
					_validator : validator,
					_target : this._target,
					_key : this._key,
					_callback : this._callback,
					_context : this._context
				});
			}
		} 
		if(!this._children) {
			this._children=Ember.A();
		}
		this._children.pushObject(observer);
	},
	
	/**
	 * Run validaton(s)
	 * 
	 * @method run
	 */
	run:function(callback) {
		var _callback=this._callback;
		this._context.result.reset();
		this._context.resetStack();
		this._validator._validate(this._context).then(function(result) {
			_callback(result);
			if(callback) {
				callback(result);
			}
		});
	},
	
	destroy : function() {
		this._detach();
		if(this._children) {
			this._children.forEach(function(child){
				child.destroy();
			});
		}
		this._super();
	},
	
	_fn: function(sender, key, value, rev){
		if(key===this._key) {
			if(sender.get(key)===this._orgValue) {
				return;
			}
			
			if(this._keys.length) {
				this._detach();
			}
			
			this._orgValue=sender.get(key);

			this._context.value=sender.get(key);

			if(this._keys.length) {
				this._attach();
			}
			
		}	
		this._context.result.reset(this._context,true);
		
		this._context.resetStack();
		
		if(this._children) {
			this._children.forEach(function(child) {
				child.destroy();
			});
		}
		
		this._validator._validate(this._context).then(this._callback);
		
		if(this._orgValue) {
			this._validator._observe(this);
		}
	},	
	
});
export default Observer;