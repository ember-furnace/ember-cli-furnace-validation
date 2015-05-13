 import Ember from "ember";
 import { test } from 'ember-qunit';
 import startApp from 'dummy/tests/helpers/start-app';
 import lookup from 'dummy/tests/helpers/lookup';
 import Validation from 'furnace-validation';
 import PropertyValidator from 'furnace-validation/validators/property';
 var App,Validator;
 module('Validation local/absent tests', {
	 setup: function() {
		 App = startApp();
 	},
	teardown: function() {
		Ember.run(App, App.destroy);
	}
});

test("Check validator", function( ) {
	Validator = lookup(App,'absent');
	var result;
	
	ok(Validator instanceof PropertyValidator, 'Check instance');
	
	result = Validator.validate(null);
	equal(result.isValid(),true,'Check null valid');	
	ok(result.getMessages().length===0,'Check messages length');
	
	result = Validator.validate(undefined);
	equal(result.isValid(),true,'Check undefined valid');		
	
	result = Validator.validate("");
	equal(result.isValid(),true,'Check empty string valid');		
	
	result = Validator.validate(0);
	equal(result.isValid(),false,'Check 0 invalid');
	equal(result.getMessages().length,1,'Check messages length');		
	equal(result.getMessages('value')[0].message,'validation.error.present','Check message name');
	
	result = result = Validator.validate("test");
	equal(result.isValid(),false,'Check string invalid');		
	
	result = Validator.validate({});
	equal(result.isValid(),false,'Check object invalid');		
});