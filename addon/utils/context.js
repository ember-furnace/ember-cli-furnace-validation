import Ember from 'ember';
import Result from '../result';
var nestContext= function(key,value) {
	// We are validating a property on an object. Cancel validation if it is not a valid object, the object validator should determine if this is valid or not   
	if(!(this.value instanceof Ember.Object)) {
		return null;
	}				
	var nestedContext= {
		value:value || this.value.get(key),
		key: key ,
		name : this.key+"."+key,
		path : this.path+"."+key,
		result : this.result,
		stack :  this.stack,
		parent :  this,
		nest: nestContext,
		resetStack : function() {
			this.stack.splice(0,this.stack.length);
		}
		
	};
	return nestedContext;
}

var createContext  = function(value,key,result) {
	return {
		value:value,			
		key: key || (value instanceof Ember.Object ? 'object' : 'value'),
		path : key || (value instanceof Ember.Object ? 'object' : 'value'),
		result : result || Result.create(),
		stack :  Ember.A(),		
		parent :  null,
		nest: nestContext,
		resetStack : function() {
			this.stack.splice(0,this.stack.length);
		}
	};
};

export default createContext;