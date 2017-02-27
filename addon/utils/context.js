import Ember from 'ember';
import Result from '../result';

function getValue(context,key) {
	let target = (context.proxy ? context.proxy.get(key) : context.value);
	if(Ember.Array.detect(target) && typeof key==='number' ) {
		return target.objectAt(key)	
	} else {
		return target.get(key);
	}
}


function nestContext(key,value) {
	// We are validating a property on an object. Cancel validation if it is not a valid object, the object validator should determine if this is valid or not   
	if(!(this.value instanceof Ember.Object)) {
		return null;
	}

	value=value || getValue(this,key);
	
	let proxy=null;
	
	if(Ember.PromiseProxyMixin.detect(value)) {
		// Use value._content for furnace-forms async proxy, do nesting with proxy instead of value @ TODO: Fix detection 
		if(value._content!==undefined) {
			value=value._content;
			proxy=value;
		} else {
			value=value.content;
		}
	} 
	var nestedContext= {
		value:value ,
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
};

function createContext(value,key,result) {
	let proxy=null;
	if(Ember.PromiseProxyMixin.detect(value)) {
		// Use value._content for furnace-forms async proxy, do nesting with proxy instead of value @ TODO: Fix detection
		if(value._content!==undefined) {
			proxy=value;
			value=value._content;
		} else {
			value=value.content;
		}
	}
	return {
		value:value,			
		key: key || (value instanceof Ember.Object ? 'object' : 'value'),
		path : key || (value instanceof Ember.Object ? 'object' : 'value'),
		name : key || (value instanceof Ember.Object ? 'object' : 'value'),
		result : result || Result.create(),
		stack :  Ember.A(),		
		parent :  null,
		proxy : proxy,
		nest: nestContext,
		resetStack : function() {
			this.stack.splice(0,this.stack.length);
		}
	};
};

export default createContext;