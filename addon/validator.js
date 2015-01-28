import Ember from 'ember';
import Lookup from './utils/lookup';
import Result from './result';
export default Ember.Object.extend({
	propertyName: null,
		
	_createContext: function(value,key,result,stack) {
		return {
			value:value,
			key: key || (value instanceof Ember.Object ? 'object' : 'value'),
			result : result || Result.create(),
			stack : stack || Ember.A()
		};
	},
	
	_nestContext: function(context,property) {
		// We are validating a property on an object. Cancel validation if it is not a valid object, the object validator should determine if this is valid or not  
		if(!(context.value instanceof Ember.Object)) {
			return null;
		}		
		return this._createContext(context.value.get(property),context.key+'.'+property,context.result,context.stack);
	},
	
	validate : function(value,result) {
		Ember.assert('Result to append to should be an instance of Result',!result || (result instanceof Result));
		var context=this._createContext(value,null,result);
		return this._validate(context);
	},
		
	_validate : function(context) {
		var propertyName=this.get('propertyName');
		var value=context.value;
		var valueName=(value instanceof Ember.Object  ? value.constructor.toString() : value);
		
		if(propertyName) {		
			context=this._nestContext(context,propertyName);
			if(!context) {
				return null;
			}
			valueName="'"+propertyName+"' on "+valueName;
		}
		var validator=this;
		return new Ember.RSVP.Promise(function(resolve,reject) {
			try{
				validator.call(context.value,context.key,context.result);
				resolve(context.result);
			}
			catch(e) {
				reject(e);
			}
		},validator.constructor.toString()+" Validating "+valueName);
	},
	
	call : function(value,key,result) {
		
	},
	
	validatorFor : Lookup
	
	
});
