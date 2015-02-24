import Ember from 'ember';
import Lookup from '../utils/lookup';
import Result from '../result';
import Observer from '../observer';
import createContext from '../utils/context';

export default Ember.Object.extend({
	
	validate : function(value,key,result) {
		Ember.assert('Result to append to should be an instance of Result',!result || (result instanceof Result));
		var context=createContext(value,key,result);
		return this._validate(context);
	},
		
	_validate : function(context) {
		context.result._valCountIncrease();
		this.call(context,context.value,context.result);
		context.result._valCountDecrease();
		return context.result;
	},
	
	call : function(context,value,result) {
		Ember.assert("Did you forget to override the 'call' method in your validator? ("+this.toString()+")");
	},
	
	validatorFor : Lookup,
	
	observe : function(target,key,callback,name) {		
		return Observer.create({
			_validator : this,
			_target : target,
			_key : key,
			_callback : callback,
			_name : name
		});
		
	},
	
	_observe : function(observer) {
		
	}
});