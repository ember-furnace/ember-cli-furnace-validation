 import Ember from "ember";
 import { test } from 'ember-qunit';
 import startApp from '../helpers/start-app';
 import Validation from 'furnace-validation';
 import PropertyValidator from 'furnace-validation/property';
 import ObjectValidator from 'furnace-validation/object';
 var App;
 
module('Validator module tests', {
	setup: function() {
		App = startApp();
	},
	teardown: function() {
		Ember.run(App, App.destroy);
	}
});

test("Interface", function( ) {
	
	ok(typeof Validation==='object',"Module interface not properly exported");
	equal(Validation.Object,ObjectValidator,"Expected ObjectValidator class");
	equal(Validation.Property,PropertyValidator,"Expected PropertyValidator class");
	ok(typeof Validation.val==='function',"Expected val function");
	ok(typeof Validation.list==='function',"Expected list function");
});

test("Validator generation", function( ) {
	
	
	var validators=Validation.val({property : true,
									object: true});
	ok(validators instanceof Ember.ComputedProperty,'No validators?');

});