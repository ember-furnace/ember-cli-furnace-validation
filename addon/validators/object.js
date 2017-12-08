import Promise from './promise';
import Ember from 'ember';

/**
 * Object validator
 * 
 * @namespace Furnace.Validation
 * @class Object
 * @extends Furnace.Validation.Promise
 */
export default Promise.extend({
	
	/**
	 * Validator instances
	 * @property _validators
	 * @protected 
	 */
	_validators : null,
	
	/**
	 * Type to check object against
	 * @property typeCheck
	 * @type Class
	 * @default null 
	 */
	typeCheck : null,
	
	_depKeys : null,
	
	/**
	 * Validators for properties
	 * @property validators
	 * @default {Object}
	 * @readOnly
	 */
	validators: Ember.computed(function() {
		var ret = {};
		var self = this;
		this.constructor.eachComputedProperty(function(name, meta) {
			if (meta.type==='validation') {
				ret[name]=self.get(name);
			}
		});
		return ret;
	}).readOnly(),
	
	/**
	 * Validator initialization
	 * @method init
	 * @protected
	 */
	init: function() {
		this._super();	
		this._validators={};
		// If we have recursive validators, getting the validators on init will cause infinite recursion
		// Do we really need to get them all on init?
		//this.get('validators');
	},
	
	_validate: function(context,paths) {		
		var promises=Ember.A();
		Ember.assert('The object validator can\'t validate enumerables',!Ember.Enumerable.detect(context.value));
		
		// Check the stack for circular checks
		// - State-validators may run different object validators on the same object. 
		// - Additionally, a nested object may run a different object check on a related parent object.
		// - Finally, we could do different object based validations on the same property
		// So: check both the value as the validator instance in the stack
		if(context.stack.filter(stack => stack.value===context.value).filter(stack => stack.validator===this).length===0) {
			context.stack.push({value:context.value,
								validator:this});
			var validators=this.get('validators');
			for(var propertyName in validators) {
				var nestedContext=context.nest(propertyName);
				if(nestedContext) {
					if(!paths || paths.indexOf(nestedContext.path)>-1) {
						context.result.setValidation(nestedContext);
						promises.pushObject(validators[propertyName]._validate(nestedContext));
					}
				}
			}
			promises.pushObject(this._super(context,paths));
		}
		
		var validator=this;
		return Ember.RSVP.all(promises,validator.constructor.toString()+" All validations for "+context.path).then(function() {
			return context.result;
		},function(e) {
			Ember.Logger.error('Exception during validation in '+validator.constructor.toString()+': '+e);
			context.result.addError(context,'validation.error.exception');
			return context.result;
		},validator.constructor.toString()+" Validations resolved");		
	},
	
	
	_validateProperty:function(propertyName,context) {
		return this.get('validators.'+propertyName).invoke('_validate',context);
	},
	
	_getDeps:function() {
		if(!this._depKeys) {
			return [];
		}
		return this._depKeys.split(',');
	},
		
	_observe : function(observer) {
		this._super(observer);
		var validators=this.get('validators');
		for(var propertyName in validators) {
			observer._observe(propertyName,validators[propertyName]);
		}
		
		var deps=this._getDeps();
		for(var i=0;i<deps.length;i++) {			
			observer._observeKey(deps[i]);			
		}
	},
	
	call : function(context,value,result) {
		if(value){
			if(!(value instanceof Ember.Object)) {
				result.addError(context,'notObject');
			} else if(this.get('typeCheck') && !(value instanceof this.get('typeCheck'))) {
				result.addError(context,'invalidType');
			}
		}
	},

}).reopenClass({
	on : function() {
		if(arguments.length===1) {						
			this.reopen({				
				_depKeys: arguments[0]
			});
		}		
		return this;
	}
});