import Ember from 'ember';
export default Ember.Object.extend({
	
	key: null,
	
	name: null,
	
	path: null,
	
	type:'unknown',
	
	message: 'unknown',
	
	toString: function() {
		return 'validation.'+this.type+'.'+this.message;
	}
	
});