 import Ember from "ember";
 import { test } from 'ember-qunit';
 import startApp from '../../helpers/start-app';
 import Validation from 'furnace-validation';
 import PropertyValidator from 'furnace-validation/property';
 var App;
 
 module('Validation property tests', {
	 setup: function() {
		 App = startApp();
 	},
	teardown: function() {
		Ember.run(App, App.destroy);
	}
});

test("Create a validator", function( ) {
	expect(2);
	var Validator = PropertyValidator.create();
	
	ok(Validator instanceof PropertyValidator, 'Check instance');
	
	// The PropertyValidator is abstract. Trying to validate with it should throw an assertion error
	Validator.validate("test").then(function(result) {
		ok(false,'Could validate');		
	}).catch(function(e) {
		ok(true,'Could not validate');
	});
		
});