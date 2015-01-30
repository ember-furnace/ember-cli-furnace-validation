import Ember from 'ember';
import Lookup from './utils/lookup';
import Result from './result';
export default Ember.Object.extend({
	propertyName: null,
		
	_createContext: function(value,key,result) {
		return {
			value:value,			
			key: key || (value instanceof Ember.Object ? 'object' : 'value'),
			path : key || (value instanceof Ember.Object ? 'object' : 'value'),
			result : result || Result.create(),
			stack :  Ember.A(),
			parent :  null
		};
	},
	
	_nestContext: function(context,key,value) {
		// We are validating a property on an object. Cancel validation if it is not a valid object, the object validator should determine if this is valid or not  
		if(!(context.value instanceof Ember.Object)) {
			return null;
		}		
		return {
			value:value || context.value.get(key),			
			key: key ,
			name : context.key+"."+key,
			path : context.path+"."+key,
			result : context.result,
			stack :  context.stack,
			parent :  context
		};
	},
	
	validate : function(value,key,result) {
		Ember.assert('Result to append to should be an instance of Result',!result || (result instanceof Result));
		var context=this._createContext(value,key,result);
		return this._validate(context);
	},
		
	_validate : function(context) {
		var validator=this;
		return new Ember.RSVP.Promise(function(resolve,reject) {
			try{
				validator.call(context,context.value,context.result);
				resolve(context.result);
			}
			catch(e) {
				reject(e);
			}
		},validator.constructor.toString()+" Validating "+context.path);
	},
	
	call : function(context,value,result) {
		Ember.assert("Did you forget to override the 'call' method in your validator? ("+this.toString()+")");
	},
	
	validatorFor : Lookup
	
	
});
