import Validator from './validator';
import ObjectValidator from './object';
import PropertyValidator from './property';
import Ember from 'ember';
export default {
	Property: PropertyValidator,
	
	Object: ObjectValidator,
	
	val : function(validators,options) {		
		if(typeof validators === 'string') {
			var name=validators;
			validators={};
			if(!options)
				options=true;
			validators[name]=options;
		}
		else {
			Ember.assert("You should either pass the name of a single validator or a hash with validator:options",typeof validators==='object');
			Ember.assert("When passing multiple validators, options should be in the validators hash",!options);
		}
		
		var meta = {
			type: 'validator',
			options:validators
		};
		
		return Ember.computed(function(key) {
			Ember.assert("You have assigned attribute validation to something thats not an ObjectValidator",this instanceof ObjectValidator);
			
			if(!this._validators[key]) {
				this._validators[key]=Ember.A();
				var meta = this.constructor.metaForProperty(key);
				var validators=meta.options;
				for(var validator in validators) {
					var options=validators[validator];
					if(options) {
						if(options===true) {
							// It was indicated just to append this validator without any options.
							// By passing null we can get a cached instance.
							options=null;
						}						
					}
					this._validators[key].push(this.validatorFor(validator,options));
				}
			}			
			return this._validators[key];
		}).meta(meta).readOnly();
	}
};
