import Ember from 'ember';
import translate from './utils/i18n';

export default Ember.Object.extend({
	
	key: null,
	
	name: null,
	
	path: null,
	
	type:'unknown',
	
	message: 'unknown',
	
	toString: function() {
		return translate('validation.'+this.type+'.'+this.message);
	}
	
});