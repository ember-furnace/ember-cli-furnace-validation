import Ember from 'ember';
/**
 * Normalize validator and options arguments 
 * @namespace Furnace.Validation
 * @private
 */
export default function getOptions(validators,options) {	
	if(typeof validators === 'string') {
		var name=validators;
		validators={};
		if(!options) {
			options=true;
		}
		validators[name]=options;
	}
	else {
		Ember.assert("You should either pass the name of a single validator or a hash with validator:options",typeof validators==='object');
		Ember.assert("When passing multiple validators, options should be in the validators hash",!options);
	}
	return validators;
}