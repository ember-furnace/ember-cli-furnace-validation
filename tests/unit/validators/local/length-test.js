 import Ember from "ember";
 import { test } from 'ember-qunit';
 import startApp from 'dummy/tests/helpers/start-app';
 import lookup from 'dummy/tests/helpers/lookup';
 import Validation from 'furnace-validation';
 import PropertyValidator from 'furnace-validation/validators/property';
 var App,Validator;
 module('Validation local/length tests', {
	 setup: function() {
		 App = startApp();
 	},
	teardown: function() {
		Ember.run(App, App.destroy);
	}
});

test("Check validator (min)", function( ) {
	var result;
	
	Validator = lookup(App,'length',{ min : 2});
	ok(Validator instanceof PropertyValidator, 'Check instance');
	result = Validator.validate(null);
	
	// Behavior has changed, check existence with required
	//ok(!result.isValid(),'Check null invalid');
	ok(result.isValid(),'Check null valid');
		
	result = Validator.validate(undefined);
	// Behavior has changed, check existence with required
	//ok(!result.isValid(),'Check undefined invalid');		
	ok(result.isValid(),'Check undefined valid');
	
	result = Validator.validate("");
	// Behavior has changed, check existence with required
	//ok(!result.isValid(),'Check empty string invalid');		
	ok(result.isValid(),'Check empty string valid');		
	
	result = Validator.validate(0);
	ok(!result.isValid(),'Check 0 invalid');	
	ok(result.getMessages().length===1,'Check messages length');
	ok(result.getMessages('value')[0].message==='tooShort','Check message name');
	ok(result.getMessages('value')[0].attributes[0]===2,'Check message attribute');
	
	result = Validator.validate(123);
	ok(result.isValid(),'Check 123 valid');		
	
	result = Validator.validate("t");
	ok(!result.isValid(),'Check short string invalid');		
	
	result = Validator.validate("test");
	ok(result.isValid(),'Check long string valid');		
	
	result = Validator.validate({});
	ok(!result.isValid(),'Check object invalid');		
	
	result = Validator.validate([]);
	ok(!result.isValid(),'Check empty array invalid');		
	
	result = Validator.validate([1,2]);
	ok(result.isValid(),'Check filled array valid');		
				
});

test("Check validator (max)", function( ) {
	var result;
	
	Validator = lookup(App,'length',{ max : 2});
	ok(Validator instanceof PropertyValidator, 'Check instance');
	
	result = Validator.validate(null);
	ok(result.isValid(),'Check null valid');		

	result = Validator.validate(undefined);
	ok(result.isValid(),'Check undefined valid');		
	
	result = Validator.validate("");
	ok(result.isValid(),'Check empty string valid');		
	
	result = Validator.validate(0);
	ok(result.isValid(),'Check 0 valid');		
	
	result = Validator.validate(123);
	ok(!result.isValid(),'Check 123 invalid');	
	ok(result.getMessages().length===1,'Check messages length');		
	ok(result.getMessages('value')[0].message==='tooLong','Check message name');
	ok(result.getMessages('value')[0].attributes[0]===2,'Check message attribute');
	
	result = Validator.validate("t");
	ok(result.isValid(),'Check short string valid');		
	
	result = Validator.validate("test");
	ok(!result.isValid(),'Check long string invalid');		
	
	result = Validator.validate({});
	ok(result.isValid(),'Check object valid');		
	
	result = Validator.validate([]);
	ok(result.isValid(),'Check empty array valid');		
	
	result = Validator.validate([1,2,3]);
	ok(!result.isValid(),'Check filled array invalid');		
				
});


test("Check validator (exact)", function( ) {
	var result;
	
	Validator = lookup(App,'length',{ exact : 2});
	ok(Validator instanceof PropertyValidator, 'Check instance');
	
	result = Validator.validate(null);
	// Behavior has changed, check existence with required
	//ok(!result.isValid(),'Check null invalid');
	ok(result.isValid(),'Check null valid');
	
	result = Validator.validate(undefined);
	// Behavior has changed, check existence with required
	//ok(!result.isValid(),'Check undefined invalid');		
	ok(result.isValid(),'Check undefined valid');		

	// Behavior has changed, check existence with required
	result = Validator.validate("");
	//ok(!result.isValid(),'Check empty string invalid');
	ok(result.isValid(),'Check empty string valid');
	
	result = Validator.validate(0);
	ok(!result.isValid(),'Check 0 invalid');		
	ok(result.getMessages().length===1,'Check messages length');		
	ok(result.getMessages('value')[0].message==='wrongLength','Check message name');
	ok(result.getMessages('value')[0].attributes[0]===2,'Check message attribute');
	
	result = Validator.validate(12);
	ok(result.isValid(),'Check 12 valid');		
	
	result = Validator.validate("t");
	ok(!result.isValid(),'Check short string invalid');		
	
	result = Validator.validate("test");
	ok(!result.isValid(),'Check long string invalid');		
	
	result = Validator.validate("te");
	ok(result.isValid(),'Check two char string valid');		
	
	result = Validator.validate({});
	ok(!result.isValid(),'Check object invalid');		
	
	result = Validator.validate([]);
	ok(!result.isValid(),'Check empty array invalid');		
	
	result = Validator.validate([1,2]);
	ok(result.isValid(),'Check filled array valid');		
				
});