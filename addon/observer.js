import Ember from 'ember';
import createContext from './utils/context';
import Result from './result';
import Queue from './observer-queue';
// FIXME: importing state validator here causing circular import dependency 
//import State from './validators/state';

/**
 * Observer for automatic object validation
 * 
 * @namespace Furnace.Validation
 * @class Observer
 */
var Observer = Ember.Object.extend({
	
	_debugLogging : false,
	
	_validator : null,
	
	_target : null,
	
	_key : null,
	
	_keys : null,
	
	_callback : null,
	
	_name : null,
	
	_context : null,
	
	_chain : null,
	
	_getValue : function() {
		Ember.warn('Validation observer received an unobservable object '+this._target+':'+this._key,Ember.Observable.detect(this._target),{id:'furnace-validation:observer-target-not-observable'});		
		var value = this._key ? Ember.get(this._target,this._key) : this._target;
		if(Ember.PromiseProxyMixin.detect(value)) {
			value=value.content;
		} 
		return value;
	},
	
	_orgValue : null,
	
	_children : null,
	
	_queue : null,
	
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
		if(this._queue===null) {
			this._queue=Queue.create({callback: this._callback});
		}
		this._keys=[];

		this._children=Ember.A();
		
		if(this._chain.length>100) {
			throw "Too much recursion?";
		}
		var chain =this._chain.filter(chain => chain.target===this._target).filter(chain => chain.key===this._key);
		if(chain.length!==0) {
			if(chain.filter(chain => chain.validator===this._validator).length===0) {
				this._validator._observe(this);
			}
		}
		else {
			this._chain.push({target : this._target,key: this._key,validator:this._validator});		
			this._orgValue=this._getValue();
			this._validator._observe(this);
			this._attach();	
		}
		
		
	},
	
	_detach:function() {		
		Ember.removeObserver(this._target,this._key,this,this._fn);
		if(Ember.Array.detect(this._orgValue)) {
			this._orgValue.removeArrayObserver(this);
		}
		this._detachKeys();
	},
	
	_detachKeys:function() {
		if(Ember.Observable.detect(this._orgValue)) {
			for(var i=0;i<this._keys.length;i++) {
				Ember.removeObserver(this._orgValue,this._keys[i],this,this._fn);
			}
		}
	},
	
	_attach: function() {
		if(this._debugLogging) {
			this._logEvent('Observing',this._target.toString(),this._key);
		}
		if(this._key) {
			Ember.addObserver(this._target,this._key,this,this._fn);
		}
		if(Ember.Array.detect(this._getValue())) {
			this._getValue().addArrayObserver(this);
		}
		this._attachKeys();
	},
	
	_attachKeys: function() {
		if(Ember.Observable.detect(this._getValue())) {
			for(var i=0;i<this._keys.length;i++) {
				Ember.addObserver(this._getValue(),this._keys[i],this,this._fn);
			}
		}
	},
	
	arrayWillChange: function() {
	},
	
	arrayDidChange: function(arr) {
		if(arr===this._getValue()) {
			this._fn(arr,this._key);
		}
	},
	
	_observeKey: function(key) {
		this._keys.push(key);
		if(Ember.Observable.detect(this._getValue())) {
			Ember.addObserver(this._getValue(),key,this,this._fn);
		}
	},
	
	_observe : function(key,validator,keepContext) {
		if(!validator) {
			validator=key;
			key=null;
			keepContext=true;
		}
		
		var observer=null;
		
		var value=this._getValue();
		if(key==='@each') {
			value=Ember.get(value,'@each._content');
			var _self=this;
			value.forEach(function(item,index) {
				var newChain=_self._chain.slice();
				if(!item) {
					Ember.warn('Nothing to observe in enumerable',item,{id:'furnace-validation:observer-observe-undefined'});
					return;
				}
				observer=Observer.create({					
					_validator : validator,
					_target : item,
					_key : null,
					_callback : _self._callback,
					_queue : _self._queue,
					_context : _self._context.nest(index,item),
					_chain : newChain
				});
			});
		} else if(value) {
			var newChain=this._chain.slice();
			if( key==="@each") {
				observer=Observer.create({
					_validator : validator,
					_target : this._target,
					_key : this._key+'.'+key,
					_callback : this._callback,
					_context : this._context,
					_queue : this._queue,
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
						_queue : this._queue,
						_chain : newChain
					});
				}else  {				
					observer=Observer.create({
						_validator : validator,
						_target : this._target,
						_key : this._key,
						_callback : this._callback,
						_context : this._context,
						_queue : this._queue,
						_chain : newChain
					});
				}
				this._children.pushObject(observer);
			}
		}
	
			
	},
	
	run:function(callback,callDefaultCallback) {
		// FIXME: implement defer or refactor queue runner with promises
		
		// First lock the queue
		// Wait for sync and gather all queued evenets
		this._queue._running=true;
		Ember.run.scheduleOnce('actions',this,this._runOnce,callback,callDefaultCallback);
	},
	
	_runOnce:function(callback,callDefaultCallback) {
		// Clear stuff in the queue
		this._queue._clear();
		var _callback=this._callback;
		var context=this._context;
		
		context.result.reset();
		context.resetStack();
		if(callDefaultCallback===undefined) {
			callDefaultCallback=true;
		}
		this._validator._validate(context).then((result) => {
			result.updateValidity(context,true);
			// Unlock queue
			this._queue._running=false;
			if(callDefaultCallback) {
				this._callback(result,null,null);
			}
			if(callback) {
				callback(result,null,null);
			}
			this._queue.run();
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
	
	_fnOnce : function(sender, key) {		
		if(key===this._key) {
			if(this._debugLogging) {
				this._logEvent('Handeling change',sender.toString(),key);
			}
			if(this._keys.length) {
				this._detachKeys();
			}
			
			this._orgValue=this._getValue();

			this._context.value=this._getValue();

			if(this._keys.length) {
				this._attachKeys();
			}
			
		}	
		

		this._queue.push(this._validator,this._context,sender);
		this._queue.run();
		
		if(this._orgValue) {
			// We need to remove ourselve from the chain, otherwise observers won't be re-attched. Not sure whether "pop" is the way to go.
			this._chain.pop();
			// We re-observe to re-add children, but it seems we may "re-observe" ourselve as well like this.
			this._validator._observe(this);
		}
	},
	
	_fn: function(sender, key, value, rev){
		// We need to run this later because of delay in ember-data relationship availablility. Better run it once as well.
		if(this._debugLogging) {
			this._logEvent('Observed change',sender.toString(),key);
		}
		if(key===this._key) {
			if(this._getValue()===this._orgValue && !Ember.MutableArray.detect(this._getValue())) {
				if(this._debugLogging) {
					this._logEvent('No change detected',sender.toString(),key);
				}
				return;
			}
			if(this._children) {
				this._children.forEach(function(child) {
					child.destroy();
				});
				this._children.clear();
			}
		} else if(this._validator._stateFn) {
			if(this._children) {
				this._children.forEach(function(child) {
					child.destroy();
				});
				this._children.clear();
			}
			if(this._validator._revalidateOnStateChange===false) {
				if(this._orgValue) {
					// We need to remove ourselve from the chain, otherwise observers won't be re-attched. Not sure whether "pop" is the way to go.
					this._chain.pop();
					// We re-observe to re-add children, but it seems we may "re-observe" ourselve as well like this.
					this._validator._observe(this);
				}
				return;
			}
		}
		
		Ember.run.scheduleOnce('actions',this,this._fnOnce,sender, key, value, rev);
	},	
	
	_logEvent : function() {
		var args=arguments;
		args[0]='Validation observer: ' + arguments[0];
		Ember.Logger.info.apply(this,args);
	}
	
	
});
export default Observer;