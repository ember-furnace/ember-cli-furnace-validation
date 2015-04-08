import Ember from "ember";
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';
import Validation from 'furnace-validation';
//import PropertyValidator from 'furnace-validation/validators/property';
//import ObjectValidator from 'furnace-validation/validators/object';

var App;
var Store;
 
module('Validator state tests', {
	setup: function() {
		App = startApp();
		Store=App.getContainer().lookup('store:main');
	},
	teardown: function() {
		Ember.run(App, App.destroy);
	}
});

test("States", function( ) {
	var Model,Validator;
	Ember.run(function() {
		Model=Store.createRecord('employee',{firstName: 'Adrian',
											lastName: ''});
	});

	Validator=Model.validatorFor();
	Validator.validate(Model).then(function(result) {
		ok(!result.isValid(),'Check invalid');
	}); 
	
	Model.set('lastName','Anderson');
	
	Validator.validate(Model).then(function(result) {
		ok(!result.isValid(),'Check invalid');
	});
	
	Model.set('position','Clerk');
	
	Validator.validate(Model).then(function(result) {
		ok(result.isValid(),'Check valid');
	}); 
	
	Model.set('position','Manager');
	
	Validator.validate(Model).then(function(result) {
		ok(!result.isValid(),'Check invalid');
	});
	
	Model.set('picture','Some profilepic');
	
	Validator.validate(Model).then(function(result) {
		ok(result.isValid(),'Check valid');
	});
});

