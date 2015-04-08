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
	
	_chain : null,
	
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
		if(this._chain===null) {
			this._chain=Ember.A();
		}
		this._keys=[];

		this._children=Ember.A();
		
		if(this._chain.length>21) {
			console.log(this._chain);
			console.log(this._chain.filterBy('target',this._target));
			Ember.debug(this._target);
			throw "whoops";
		}
		
		if(this._chain.filterBy('target',this._target).filterBy('key',this._key).length!==0) {
			return;
		}
		
		this._chain.push({target : this._target,key: this._key});		
		this._orgValue=this._getValue();
		this._validator._observe(this);
		this._attach();
		
	},
	
	_detach:function() {
		this._target.removeObserver(this._key,this,this._fn);
		for(var i=0;i<this._keys.length;i++) {
			this._orgValue.removeObserver(this._keys[i],this,this._fn);
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
		
		if(value instanceof Ember.EachProxy) {
			value=value.get('_content');
			var _self=this;
			value.forEach(function(item,index) {
				var newChain=_self._chain.copy();
				observer=Observer.create({
					_validator : validator,
					_target : item,
					_key : key,
					_callback : _self._callback,
					_context : _self._context.nest(index,item),
					_chain : newChain
				});
			});
		} else if(value) {
			var newChain=this._chain.copy();
			if( key==="@each") {
				observer=Observer.create({
					_validator : validator,
					_target : this._target,
					_key : this._key+'.'+key,
					_callback : this._callback,
					_context : this._context,
					_chain : newChain
				});
			} else {
				if(!keepContext) {	
					observer=Observer.create({
						_validator : validator,
						_target : value,
						_key : key,
						_callback : this._callback,
						_context : this._context.nest(key),
						_chain : newChain
					});
				}else  {				
					observer=Observer.create({
						_validator : validator,
						_target : this._target,
						_key : this._key,
						_callback : this._callback,
						_context : this._context,
						_chain : newChain
					});
				}
				this._children.pushObject(observer);
			}
		} 
	
			
	},
	
	run:function(callback,callDefaultCallback) {
		var _callback=this._callback;
		var context=this._context;
		
		context.result.reset();
		context.resetStack();
		if(callDefaultCallback===undefined) {
			callDefaultCallback=true;
		}
		this._validator._validate(context).then(function(result) {
			result.updateValidity(context,true);
			if(callDefaultCallback) {
				_callback(result,null,null);
			}
			if(callback) {
				callback(result,null,null);
			}
		});
	},
	
	destroy : function() {
		this._detach();
		if(this._children) {
			this._children.forEach(function(child){
				child.destroy();
			});
			this._children.clear();
		}
		this._super();
	},
	
	getResult: function() {
		return this._context.result;
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
			this._children.clear();
		}
		
		var context=this._context;
		var callback=this._callback;
		
		this._validator._validate(this._context).then(function(result){
			result.updateValidity(context,true);
			callback(result,sender,key);
		});
		
		if(this._orgValue) {
			this._validator._observe(this);
		}
	},	
	
});
export default Observer;