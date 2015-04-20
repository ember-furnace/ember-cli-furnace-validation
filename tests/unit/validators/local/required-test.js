 import Ember from "ember";
 import { test } from 'ember-qunit';
 import startApp from 'dummy/tests/helpers/start-app';
 import lookup from 'dummy/tests/helpers/lookup';
 import Validation from 'furnace-validation';
 import PropertyValidator from 'furnace-validation/validators/property';
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
	var result;
	
	Validator = lookup(App,'required');
	
	ok(Validator instanceof PropertyValidator, 'Check instance');
	
	result = Validator.validate(null);
	ok(!result.isValid(),'Check null invalid');
	ok(result.getMessages().length===1,'Check messages length');		
	ok(result.getMessages('value')[0].message==='blank','Check message name');

	result = Validator.validate(undefined);
	ok(!result.isValid(),'Check undefined invalid');		
	
	result = Validator.validate("");
	ok(!result.isValid(),'Check empty string invalid');
	
	result = Validator.validate(false);
	ok(!result.isValid(),'Check false string invalid');		
	
	result = Validator.validate(0);
	ok(result.isValid(),'Check 0 valid');
	ok(result.getMessages().length===0,'Check messages length');	
	
	result = Validator.validate("test");
	ok(result.isValid(),'Check string valid');		
	
	result = Validator.validate({});
	ok(result.isValid(),'Check object valid');		
	
	result = Validator.validate(true);
	ok(result.isValid(),'Check true valid');
});