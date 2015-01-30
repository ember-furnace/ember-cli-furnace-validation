 import Ember from "ember";
 import { test } from 'ember-qunit';
 import startApp from 'dummy/tests/helpers/start-app';
 import lookup from 'dummy/tests/helpers/lookup';
 import Validation from 'furnace-validation';
 import PropertyValidator from 'furnace-validation/property';
 var App,Validator;
 module('Validation local/required tests', {
	 setup: function() {
		 App = startApp();
 	},
	teardown: function() {
		Ember.run(App, App.destroy);
	}
});

test("Check validator", function( ) {
	Validator = lookup(App,'required');
	
	ok(Validator instanceof PropertyValidator, 'Check instance');
	
	Validator.validate(null).then(function(result) {
		ok(!result.isValid(),'Check null invalid');
		ok(result.getMessages().length===1,'Check messages length');		
		ok(result.getMessages('value')[0].message==='blank','Check message name');
	});
	Validator.validate(undefined).then(function(result) {
		ok(!result.isValid(),'Check undefined invalid');		
	});
	
	Validator.validate("").then(function(result) {
		ok(!result.isValid(),'Check empty string invalid');		
	});
	
	Validator.validate(0).then(function(result) {
		ok(result.isValid(),'Check 0 valid');
		ok(result.getMessages().length===0,'Check messages length');	
	});
	
	Validator.validate("test").then(function(result) {
		ok(result.isValid(),'Check string valid');		
	});
	
	Validator.validate({}).then(function(result) {
		ok(result.isValid(),'Check object valid');		
	});
});