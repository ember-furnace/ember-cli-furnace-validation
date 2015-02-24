import ObjectValidator from './validators/object';
import PropertyValidator from './validators/property';
import PromiseValidator from './validators/promise';
import EnumValidator from './validators/enum';
import CollectionValidator from './validators/collection';
import Ember from 'ember';

var getValidators=function(validators,options) {
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
	return validators;
};

var getMeta=function(validators,type) {
	type=type || 'validation';
	return {
		type: type,
		validators:validators
	};
};

var getComputed=function(validators) {
	return Ember.computed(function(key) {
		Ember.assert("You have assigned attribute validation to something thats not an ObjectValidator",this instanceof ObjectValidator);
		
		if(!this._validators[key]) {
			this._validators[key]=CollectionValidator.create();
			var meta = this.constructor.metaForProperty(key);
			var validators=meta.validators;
			for(var validator in validators) {
				var options=validators[validator];
				if(options) {
					if(options===true) {
						// It was indicated just to append this validator without any options.
						// By passing null we can get a cached instance.
						options=null;
					}						
				}
				if(validator==='enum') {
					this._validators[key].push(EnumValidator.create({validators : options}));
				} else {
					this._validators[key].push(this.validatorFor(validator,options));
				}
			}
		}			
		return this._validators[key];
	});
};
export default {
	Property: PropertyValidator,
	
	Object: ObjectValidator,
	
	Promise: PromiseValidator,
	
	enum : function(validators,options) {
		var listValidators={};
		if(validators) {
			listValidators=getValidators(validators,options);
		}
		var meta = getMeta(listValidators);
		
		var list = getComputed().meta(meta);
		list.val = function(validators,options) {
			var itemValidators=this._meta.validators || {};
			itemValidators['enum']=getValidators(validators,options);
			var meta = getMeta(itemValidators);
			return this.meta(meta);
		};
		return list;
	},
	
	val : function(validators,options) {		
		validators=getValidators(validators,options);
		
		var meta = getMeta(validators);
		
		return getComputed().meta(meta).readOnly();
	}
};
