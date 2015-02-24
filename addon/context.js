import Ember from 'ember';

var Context = Ember.Object.extend({
		value : null,
		key : null,
		name : null,
		path : null,
		stack: null,
		parent: null,
		result: null,
		
		nest : function(key,value) {
			// We are validating a property on an object. Cancel validation if it is not a valid object, the object validator should determine if this is valid or not   
			if(!(this.value instanceof Ember.Object)) {
				return null;
			}				
			var nestedContext= Context.create( {
				value:value || this.value.get(key),
				key: key ,
				name : this.key+"."+key,
				path : this.path+"."+key,
				result : this.result,
				stack :  this.stack,
				parent :  this,
			});
			return nestedContext;
		}
});
export default Context;