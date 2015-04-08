import Collection from './collection';
import Ember from 'ember';

/**
 * Enumerable validator
 * 
 * @namespace Furnace.Validation
 * @class Enum
 * @extends Furnace.Validation.Object
 */
export default Collection.extend({
	
	_observe : function(observer) {
		this._super(observer);
		if(observer._getValue() && typeof observer._getValue()==='object') {
			observer._observeKey('@each');
		}
	},
	
	
});
