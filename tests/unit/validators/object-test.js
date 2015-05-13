 import Ember from "ember";
 import { test } from 'ember-qunit';
 import startApp from '../../helpers/start-app';
 import Validation from 'furnace-validation';
 import ObjectValidator from 'furnace-validation/validators/object';
 var App;
 var Validator;
 module('Validation object tests', {
	 setup: function() {
		 App = startApp();
 	},
	teardown: function() {
		Ember.run(App, App.destroy);
	}
});

test("Check validator", function( ) {
	expect(6);
	Validator = ObjectValidator.create();
	
	ok(Validator instanceof ObjectValidator, 'Check instance');
	
	Validator.validate("test").then(function(result) {
		equal(result.isValid(),false,'Check "string" invalid');		
	});
	
	Validator.validate({}).then(function(result) {
		equal(result.isValid(),false,'Check "object" invalid');		
	});
	
	Validator.validate(Ember.Object.create()).then(function(result) {
		equal(result.isValid(),true,'Check "Ember.Object" valid');		
	});
	
	Validator.set('typeCheck',ObjectValidator);
	
	Validator.validate(Ember.Object.create()).then(function(result) {
		equal(result.isValid(),false,'Check "TypeCheck" invalid');		
	});
	Validator.validate(Validator).then(function(result) {
		equal(result.isValid(),true,'Check "TypeCheck" valid');		
	});
});