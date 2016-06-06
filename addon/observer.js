import Ember from 'ember';
import createContext from './utils/context';
import Result from './result';
import Queue from './observer-queue';
import State from './validators/state';

var EachProxy = Ember.__loader.require('ember-runtime/system/each_proxy')['EachProxy'] || Ember.__loader.require('ember-runtime/system/each_proxy').default;

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
		Ember.assert('Validation observer received an unobservable object',Ember.Observable.detect(this._target));
		var value = Ember.get(this._target,this._key);
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
			console.log(this._chain);
			throw "Too much recursion?";
		}
		var chain =this._chain.filterBy('target',this._target).filterBy('key',this._key);
		if(chain.length!==0) {			
			if(chain.filterBy('validator',this._validator).length===0) {
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
		this._target.removeObserver(this._key,this,this._fn);
		if(Ember.Array.detect(this._orgValue)) {
			this._orgValue.removeArrayObserver(this);
		}
		this._detachKeys();
	},
	
	_detachKeys:function() {
		if(Ember.Observable.detect(this._orgValue)) {
			for(var i=0;i<this._keys.length;i++) {
				this._orgValue.removeObserver(this._keys[i],this,this._fn);
			}
		}
	},
	
	_attach: function() {
		if(this._debugLogging) {
			this._logEvent('Observing',this._target.toString(),this._key);
		}
		this._target.addObserver(this._key,this,this._fn);
		if(Ember.Array.detect(this._getValue())) {
			this._getValue().addArrayObserver(this);
		}
		this._attachKeys();
	},
	
	_attachKeys: function() {
		if(Ember.Observable.detect(this._getValue())) {
			for(var i=0;i<this._keys.length;i++) {
				this._getValue().addObserver(this._keys[i],this,this._fn);
			}
		}
	},
	
	arrayWillChange: function(arr) {
	},
	
	arrayDidChange: function(arr) {
		this._fnOnce(arr,this._key);
	},
	
	_observeKey: function(key) {
		this._keys.push(key);
		if(Ember.Observable.detect(this._getValue())) {
			this._getValue().addObserver(key,this,this._fn);
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
		if(value instanceof EachProxy) {
			value=Ember.get(value,'_content');
			var _self=this;
			value.forEach(function(item,index) {
				var newChain=_self._chain.copy();
				observer=Observer.create({					
					_validator : validator,
					_target : item,
					_key : key,
					_callback : _self._callback,
					_queue : _self._queue,
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
	
	_fnOnce : function(sender, key, value, rev) {		
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
		} else if(this._validator instanceof State) {			
			if(this._children) {
				this._children.forEach(function(child) {
					child.destroy();
				});
				this._children.clear();
			}
		}
		
		Ember.run.scheduleOnce('sync',this,this._fnOnce,sender, key, value, rev);
	},	
	
	_logEvent : function() {
		var args=arguments;
		args[0]='Validation observer: ' + arguments[0];
		Ember.Logger.info.apply(this,args);
	}
	
	
});
export default Observer;