import Ember from 'ember';
import createContext from './utils/context';
import Result from './result';
var Observer = Ember.Object.extend({
	
	_validator : null,
	
	_target : null,
	
	_key : null,
	
	_callback : null,
	
	_name : null,
	
	_context : null,
	
	_getValue : function() {
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
		
		this._orgValue=this._getValue();
		this._validator._observe(this);
		this._attach();
	},
	
	_detach:function() {
		this._target.removeObserver(this._key,this,this._fn);
	},
	
	_attach: function() {
		this._target.addObserver(this._key,this,this._fn);
	},

	
	_observe : function(key,validator) {
		var observer=null
		var value=this._getValue();
		if(value) {
			observer=Observer.create({
				_validator : validator,
				_target : value,
				_key : key,
				_callback : this._callback,
				_context : this._context.nest(key,value)
			});
		} 
		if(!this._children) {
			this._children=Ember.A();
		}
		this._children.pushObject(observer);
	},
	
	run:function(callback) {
		var _callback=this._callback;
		this._validator._validate(this._context).then(function(result) {
			_callback(result);
			callback(result);
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
		if(sender.get(key)===this._orgValue) {
			return;
		}
		this._orgValue=sender.get(key);

		this._context.value=sender.get(key);
			
		this._context.result.reset(this._context);
		
		this._validator._validate(this._context).then(this._callback);
		
		if(this._children) {
			this._children.forEach(function(child) {
				child.destroy();
			});
		}
		
		if(this._orgValue) {
			this._validator._observe(this);
		}
	},	
	
});
export default Observer;