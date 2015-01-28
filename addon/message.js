import Ember from 'ember';
export default Ember.Object.extend({
	type:'error',
	message: 'unknown',
	
	toString: function() {
		return 'validation.'+this.type+'.'+this.message;
	}
	
})