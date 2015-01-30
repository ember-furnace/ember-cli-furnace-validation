 import Ember from "ember";
 import { test } from 'ember-qunit';
 import startApp from 'dummy/tests/helpers/start-app';
 import lookup from 'dummy/tests/helpers/lookup';
 import Validation from 'furnace-validation';
 import PropertyValidator from 'furnace-validation/property';
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
	Validator = lookup(App,'length',{ min : 2});
	ok(Validator instanceof PropertyValidator, 'Check instance');
	
	Validator.validate(null).then(function(result) {		
		ok(!result.isValid(),'Check null invalid');	
		ok(result.getMessages().length===1,'Check messages length');		
		ok(result.getMessages('value')[0].message==='tooShort','Check message name');
		ok(result.getMessages('value')[0].attributes[0]===2,'Check message attribute');
	});
	Validator.validate(undefined).then(function(result) {
		ok(!result.isValid(),'Check undefined invalid');		
	});
	
	Validator.validate("").then(function(result) {
		ok(!result.isValid(),'Check empty string invalid');		
	});
	
	Validator.validate(0).then(function(result) {
		ok(!result.isValid(),'Check 0 invalid');		
	});
	
	Validator.validate(123).then(function(result) {
		ok(result.isValid(),'Check 123 valid');		
	});
	
	
	Validator.validate("t").then(function(result) {
		ok(!result.isValid(),'Check short string invalid');		
	});
	
	Validator.validate("test").then(function(result) {
		ok(result.isValid(),'Check long string valid');		
	});
	
	Validator.validate({}).then(function(result) {
		ok(!result.isValid(),'Check object invalid');		
	});
	
	Validator.validate([]).then(function(result) {
		ok(!result.isValid(),'Check empty array invalid');		
	});
	
	Validator.validate([1,2]).then(function(result) {
		ok(result.isValid(),'Check filled array valid');		
	});
				
});

test("Check validator (max)", function( ) {
	Validator = lookup(App,'length',{ max : 2});
	ok(Validator instanceof PropertyValidator, 'Check instance');
	
	Validator.validate(null).then(function(result) {
		ok(result.isValid(),'Check null valid');		
	});
	Validator.validate(undefined).then(function(result) {
		ok(result.isValid(),'Check undefined valid');		
	});
	
	Validator.validate("").then(function(result) {
		ok(result.isValid(),'Check empty string valid');		
	});
	
	Validator.validate(0).then(function(result) {
		ok(result.isValid(),'Check 0 valid');		
	});
	
	Validator.validate(123).then(function(result) {
		ok(!result.isValid(),'Check 123 invalid');	
		ok(result.getMessages().length===1,'Check messages length');		
		ok(result.getMessages('value')[0].message==='tooLong','Check message name');
		ok(result.getMessages('value')[0].attributes[0]===2,'Check message attribute');
	});
	
	Validator.validate("t").then(function(result) {
		ok(result.isValid(),'Check short string valid');		
	});
	
	Validator.validate("test").then(function(result) {
		ok(!result.isValid(),'Check long string invalid');		
	});
	
	Validator.validate({}).then(function(result) {
		ok(result.isValid(),'Check object valid');		
	});
	
	Validator.validate([]).then(function(result) {
		ok(result.isValid(),'Check empty array valid');		
	});
	
	Validator.validate([1,2,3]).then(function(result) {
		ok(!result.isValid(),'Check filled array invalid');		
	});
				
});


test("Check validator (exact)", function( ) {
	Validator = lookup(App,'length',{ exact : 2});
	ok(Validator instanceof PropertyValidator, 'Check instance');
	
	Validator.validate(null).then(function(result) {
		ok(!result.isValid(),'Check null invalid');		
		ok(result.getMessages().length===1,'Check messages length');		
		ok(result.getMessages('value')[0].message==='wrongLength','Check message name');
		ok(result.getMessages('value')[0].attributes[0]===2,'Check message attribute');
	});
	Validator.validate(undefined).then(function(result) {
		ok(!result.isValid(),'Check undefined invalid');		
	});
	
	Validator.validate("").then(function(result) {
		ok(!result.isValid(),'Check empty string invalid');		
	});
	
	Validator.validate(0).then(function(result) {
		ok(!result.isValid(),'Check 0 invalid');		
	});
	
	Validator.validate(12).then(function(result) {
		ok(result.isValid(),'Check 12 valid');		
	});
	
	Validator.validate("t").then(function(result) {
		ok(!result.isValid(),'Check short string invalid');		
	});
	
	Validator.validate("test").then(function(result) {
		ok(!result.isValid(),'Check long string invalid');		
	});
	
	Validator.validate("te").then(function(result) {
		ok(result.isValid(),'Check two char string valid');		
	});
	
	Validator.validate({}).then(function(result) {
		ok(!result.isValid(),'Check object invalid');		
	});
	
	Validator.validate([]).then(function(result) {
		ok(!result.isValid(),'Check empty array invalid');		
	});
	
	Validator.validate([1,2]).then(function(result) {
		ok(result.isValid(),'Check filled array valid');		
	});
				
});