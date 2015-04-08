import Promise from './promise';
import Ember from 'ember';

/**
 * State validator
 * 
 * @namespace Furnace.Validation
 * @class State
 * @extends Furnace.Validation.Promise
 */
var State= Promise.extend({
	_validators : null,
	
	_stateFn : null,
	
	_stateDeps : null,
	
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
	
	init: function() {
		this._super();	
		this._validators={};
	},
	
	_hasState:function(context,state) {			
		return this._getStates(context).indexOf(state)>-1;
	},
	
	_getStates:function(context) {
		Ember.assert('No method to determine object state. Did you forget to call "cond()" after extending?',typeof this._stateFn==='function');
		var states=this._stateFn(context.value,context);
		if(!Ember.isArray(states)) {
			states=[states];
		}
		return states;
	},
	
	_getDeps:function() {
		if(!this._stateDeps) {
			return [];
		}
		return this._stateDeps.split(',');
	},
	
	_validate: function(context) {		
		var promises=Ember.A();
		Ember.assert('The state validator can\'t validate enumerables',!Ember.Enumerable.detect(context.value));
		var validators=this.get('validators');
		var states=this._getStates(context);
		for(var propertyName in validators) {			
			if(states.indexOf(propertyName)>-1) {
				promises.pushObject(validators[propertyName]._validate(context));
			}
		}
		Ember.warn('State validator ran without a validatable state, the result might remain invalid if no other validations were ran!',promises.length!==0);
		var validator=this;
		return Ember.RSVP.all(promises,validator.constructor.toString()+" All validations for "+context.path).then(function(values) {
			return context.result;
		},function(e) {
			return e;
		},validator.constructor.toString()+" Validations resolved");		
	},
	
	_validateProperty:function(propertyName,context) {
		return this.get('validators.'+propertyName).invoke('_validate',context);
	},
	
		
	_observe : function(observer) {
		this._super(observer);
		var validators=this.get('validators');
		var states=this._getStates(observer._context);		
		for(var propertyName in validators) {
			if(states.indexOf(propertyName)>-1) {
				observer._observe(validators[propertyName]);
			}
		}
		var deps=this._getDeps();
		for(var i=0;i<deps.length;i++) {			
			observer._observeKey(deps[i]);			
		}
	},
	
});

State.reopenClass({
	/**
	 * Set condition for state class
	 * @method cond
	 * @param fn {Mixed} Function for determining state or single property do determine object state by
	 * @param dependendKeys (optional) {String} Comma separated list of keys causing state changes 
	 * @static
	 * @return {Furnace.Validation.State} State class with condition appended
	 */
	cond : function() {
		if(arguments.length===1) {
			Ember.assert("When passing 1 argument to cond() the first argument is expected to be a single property to determine state",typeof arguments[0]==='string' && arguments[0].split(',').length===1);
			
			this.reopen({
				_stateFn: function(object) {
					return object.get(this._stateDeps);
				},
				_stateDeps: arguments[0]
			});
		}
		if(arguments.length===2) {
			Ember.assert("When passing 2 arguments to cond() the first argument is expected to be a function to determine state",typeof arguments[0]==='function');
			Ember.assert("When passing 2 arguments to cond() the second argument is expected to be a string defining dependent attributes",typeof arguments[1]==='string');
			
			this.reopen({
				_stateFn: arguments[0],
				_stateDeps: arguments[1]
			});
		}
		return this;
	}
});

export default State;
