import ObjectValidator from './validators/object';
import StateValidator from './validators/state';
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

var getComputed=function() {
	return Ember.computed(function(key) {
		Ember.assert("You have an assigned attribute validation to something thats not an ObjectValidator",(this instanceof ObjectValidator || this instanceof StateValidator));
		
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
				var _validator;
				switch(validator) {
					case 'enum':
						_validator=EnumValidator.create({validators : options});
						break;
					case 'state':
						_validator=StateValidator.extend(options).create({container: this.get('container')});
						break;
					case 'object':
						_validator=ObjectValidator.extend(options).create({container: this.get('container')});
						break;
					default:
						_validator=this.validatorFor(validator,options);
						break;
				}
				this._validators[key].push(_validator);
				
			}
		}			
		return this._validators[key];
	});
};
export default {
	Property: PropertyValidator,
	
	Object: ObjectValidator,
	
	State: StateValidator,
	
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
	
	object: function(options) {
		 return this.val('object' ,options);
	},
	
	state: function(fn,deps,options) {		
		options=options || {};
		options._stateFn=fn;
		options._stateDeps=deps;
		return this.val('state' ,options);
	},
	
	val : function(validators,options) {
		validators=getValidators(validators,options);
		
		var meta = getMeta(validators);
		return getComputed().meta(meta).readOnly();
	}
};
