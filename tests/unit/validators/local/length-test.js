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
	//equal(result.isValid(),false,'Check null invalid');
	equal(result.isValid(),true,'Check null valid');
		
	result = Validator.validate(undefined);
	// Behavior has changed, check existence with required
	//equal(result.isValid(),false,'Check undefined invalid');		
	equal(result.isValid(),true,'Check undefined valid');
	
	result = Validator.validate("");
	// Behavior has changed, check existence with required
	//equal(result.isValid(),false,'Check empty string invalid');		
	equal(result.isValid(),true,'Check empty string valid');		
	
	result = Validator.validate(0);
	equal(result.isValid(),false,'Check 0 invalid');	
	equal(result.getMessages().length,1,'Check messages length');
	equal(result.getMessages('value')[0].message,'validation.error.stringTooShort','Check message name');
	equal(result.getMessages('value')[0].attributes[0],2,'Check message attribute');
	
	result = Validator.validate(123);
	equal(result.isValid(),true,'Check 123 valid');		
	
	result = Validator.validate("t");
	equal(result.isValid(),false,'Check short string invalid');		
	
	result = Validator.validate("test");
	equal(result.isValid(),true,'Check long string valid');		
	
	result = Validator.validate({});
	// Behavior has changed, check existence with required
	//equal(result.isValid(),false,'Check object invalid');		
	equal(result.isValid(),true,'Check object valid');		
	
	// Behavior has changed, check existence with required
	result = Validator.validate([]);
	//equal(result.isValid(),false,'Check empty array invalid');		
	equal(result.isValid(),true,'Check empty array valid');		
	
	result = Validator.validate([1,2]);
	equal(result.isValid(),true,'Check filled array valid');		
				
});

test("Check validator (max)", function( ) {
	var result;
	
	Validator = lookup(App,'length',{ max : 2});
	ok(Validator instanceof PropertyValidator, 'Check instance');
	
	result = Validator.validate(null);
	equal(result.isValid(),true,'Check null valid');		

	result = Validator.validate(undefined);
	equal(result.isValid(),true,'Check undefined valid');		
	
	result = Validator.validate("");
	equal(result.isValid(),true,'Check empty string valid');		
	
	result = Validator.validate(0);
	equal(result.isValid(),true,'Check 0 valid');		
	
	result = Validator.validate(123);
	equal(result.isValid(),false,'Check 123 invalid');	
	equal(result.getMessages().length,1,'Check messages length');		
	equal(result.getMessages('value')[0].message,'validation.error.stringTooLong','Check message name');
	equal(result.getMessages('value')[0].attributes[0],2,'Check message attribute');
	
	result = Validator.validate("t");
	equal(result.isValid(),true,'Check short string valid');		
	
	result = Validator.validate("test");
	equal(result.isValid(),false,'Check long string invalid');		
	
	result = Validator.validate({});
	equal(result.isValid(),true,'Check object valid');		
	
	result = Validator.validate([]);
	equal(result.isValid(),true,'Check empty array valid');		
	
	result = Validator.validate([1,2,3]);
	equal(result.isValid(),false,'Check filled array invalid');		
				
});


test("Check validator (exact)", function( ) {
	var result;
	
	Validator = lookup(App,'length',{ exact : 2});
	ok(Validator instanceof PropertyValidator, 'Check instance');
	
	result = Validator.validate(null);
	// Behavior has changed, check existence with required
	//equal(result.isValid(),false,'Check null invalid');
	equal(result.isValid(),true,'Check null valid');
	
	result = Validator.validate(undefined);
	// Behavior has changed, check existence with required
	//equal(result.isValid(),false,'Check undefined invalid');		
	equal(result.isValid(),true,'Check undefined valid');		

	// Behavior has changed, check existence with required
	result = Validator.validate("");
	//equal(result.isValid(),false,'Check empty string invalid');
	equal(result.isValid(),true,'Check empty string valid');
	
	result = Validator.validate(0);
	equal(result.isValid(),false,'Check 0 invalid');		
	equal(result.getMessages().length,1,'Check messages length');		
	equal(result.getMessages('value')[0].message,'validation.error.stringWrongLength','Check message name');
	equal(result.getMessages('value')[0].attributes[0],2,'Check message attribute');
	
	result = Validator.validate(12);
	equal(result.isValid(),true,'Check 12 valid');		
	
	result = Validator.validate("t");
	equal(result.isValid(),false,'Check short string invalid');		
	
	result = Validator.validate("test");
	equal(result.isValid(),false,'Check long string invalid');		
	
	result = Validator.validate("te");
	equal(result.isValid(),true,'Check two char string valid');		
	
	// Behavior has changed, check existence with required
	result = Validator.validate({});
	//equal(result.isValid(),false,'Check object invalid');		
	equal(result.isValid(),true,'Check object valid');		
	
	// Behavior has changed, check existence with required
	result = Validator.validate([]);
	//equal(result.isValid(),false,'Check empty array invalid');		
	equal(result.isValid(),true,'Check empty array valid');		
	
	result = Validator.validate([1,2]);
	equal(result.isValid(),true,'Check filled array valid');		
				
});