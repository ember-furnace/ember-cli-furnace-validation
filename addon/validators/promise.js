import Abstract from './abstract';
import Ember from 'ember';

/**
 * Promise validator
 * 
 * @namespace Furnace.Validation
 * @extends Furnace.Validation.Abstract
 * @class Promise
 */
export default Abstract.extend({
	_validate : function(context,paths) {
		var validator=this;
		if(!paths || paths.indexOf(context.path)>-1) {
			context.result._valCountIncrease();
			if(this._debugLogging) {
				this._logEvent('Validating',context.path);
			}
			return new Ember.RSVP.Promise(function(resolve,reject) {
				try{
					var ret = validator.call(context,context.value,context.result);
					if(ret instanceof Ember.RSVP.Promise) {
						ret.then(function() {
							resolve(context.result);
						}).catch(reject);
					} else {
						resolve(context.result);
					}
				}
				catch(e) {
					reject(e);
				}
			},validator.constructor.toString()+" Validating "+context.path).finally(function(){
				context.result._valCountDecrease();
			});	
		} 
	}
});