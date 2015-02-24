import Ember from "ember";
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';
import Validation from 'furnace-validation';
import PropertyValidator from 'furnace-validation/property';
import ObjectValidator from 'furnace-validation/object';

var App;
var Store;
 
module('Validator basic tests', {
	setup: function() {
		App = startApp();
		Store=App.getContainer().lookup('store:main');
	},
	teardown: function() {
		Ember.run(App, App.destroy);
	}
});

test("Single model", function( ) {
	var Model,Validator;
	Ember.run(function() {
		Model=Store.createRecord('person',{firstName: 'Adrian',
											lastName: ''});
	});

	Validator=Model.validatorFor();
	
	Validator.validate(Model).then(function(result) {
		ok(!result.isValid(),'Check invalid');
	}); 
	
	Model.set('lastName','Anderson');
	
	Validator.validate().then(function(result) {
		ok(result.isValid(),'Check valid');
	}); 
});

test("Nested models", function( ) {
	var Model,Model2,Validator;
	Ember.run(function() {
		Model=Store.createRecord('person',{firstName: 'Adrian',
											lastName: 'Anderson'});
		Model2=Store.createRecord('address',{street: 'A street',
											zipcode: 'AA',
											city:''});
		
		Model.set('address',Model2);
	});

	Validator=Model.validatorFor();
	
	Validator.validate(Model).then(function(result) {
		ok(!result.isValid(),'Check invalid');
	}); 
	
	Model2.set('city','Addison');
	
	Validator.validate(Model).then(function(result) {
		ok(result.isValid(),'Check valid');
	});
});

test("Nested models with circular reference", function( ) {
	var Model,Model2,Validator;
	
	Ember.run(function() {
		Model=Store.createRecord('person',{firstName: 'Adrian',
											lastName: 'Anderson'});
		Model2=Store.createRecord('person',{firstName: 'Brian',
											lastName: '',
											bestFriend:Model});
				
		Model.set('bestFriend',Model2);
		Model2.set('bestFriend',Model);
	});

	Validator=Model.validatorFor();
	
	Validator.validate(Model).then(function(result) {
		ok(!result.isValid(),'Check invalid');
	}); 
	
	Model2.set('lastName','Brooks');
	
	Validator.validate(Model).then(function(result) {
		ok(result.isValid(),'Check valid');
	});
});


test("Nested models in a list", function( ) {
	var Model,Model2,Validator;
	Ember.run(function() {
		Model=Store.createRecord('person',{firstName: 'Adrian',
											lastName: 'Anderson'});
		Model2=Store.createRecord('person',{firstName: 'Brian',
											lastName: ''});
				
		Model.get('friends').pushRecord(Model2);
	});
	Validator=Model.validatorFor();

	Validator.validate(Model).then(function(result) {
		ok(!result.isValid(),'Check invalid');
	}); 
	
	Ember.run(function() {
		Model2.set('lastName','Brooks');
	});
	
	Validator.validate(Model).then(function(result) {
		ok(result.isValid(),'Check valid');
	});
	
});

test("Nested models in a list with circular reference", function( ) {
	var Model,Model2,Validator;
	Ember.run(function() {
		Model=Store.createRecord('person',{firstName: 'Adrian',
											lastName: 'Anderson'});
		Model2=Store.createRecord('person',{firstName: 'Brian',
											lastName: '',
											});
		
		Model.get('friends').pushRecord(Model2);
		Model2.get('friends').pushRecord(Model);
	});

	Validator=Model.validatorFor();
	
	Validator.validate(Model).then(function(result) {
		ok(!result.isValid(),'Check invalid');
	}); 
	
	Ember.run(function() {
		Model2.set('lastName','Brooks');
	});
	
	Validator.validate(Model).then(function(result) {
		ok(result.isValid(),'Check valid');
	}); 
	

});