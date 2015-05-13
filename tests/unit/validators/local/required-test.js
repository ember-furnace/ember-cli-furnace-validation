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
	equal(result.isValid(),false,'Check null invalid');
	equal(result.getMessages().length,1,'Check messages length');		
	equal(result.getMessages('value')[0],'validation.error.blank','Check message name');

	result = Validator.validate(undefined);
	equal(result.isValid(),false,'Check undefined invalid');		
	
	result = Validator.validate("");
	equal(result.isValid(),false,'Check empty string invalid');
	
	result = Validator.validate(false);
	equal(result.isValid(),false,'Check false string invalid');		
	
	result = Validator.validate(0);
	equal(result.isValid(),true,'Check 0 valid');
	equal(result.getMessages().length,0,'Check messages length');	
	
	result = Validator.validate("test");
	equal(result.isValid(),true,'Check string valid');		
	
	result = Validator.validate({});
	equal(result.isValid(),true,'Check object valid');		
	
	result = Validator.validate(true);
	equal(result.isValid(),true,'Check true valid');
});