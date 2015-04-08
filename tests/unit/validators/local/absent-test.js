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
	ok(result.isValid(),'Check null valid');	
	ok(result.getMessages().length===0,'Check messages length');
	
	result = Validator.validate(undefined);
	ok(result.isValid(),'Check undefined valid');		
	
	result = Validator.validate("");
	ok(result.isValid(),'Check empty string valid');		
	
	result = Validator.validate(0);
	ok(!result.isValid(),'Check 0 invalid');
	ok(result.getMessages().length===1,'Check messages length');		
	ok(result.getMessages('value')[0].message==='present','Check message name');
	
	result = result = Validator.validate("test");
	ok(!result.isValid(),'Check string invalid');		
	
	result = Validator.validate({});
	ok(!result.isValid(),'Check object invalid');		
});