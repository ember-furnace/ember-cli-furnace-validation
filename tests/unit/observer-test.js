import Ember from "ember";
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';
import Validation from 'furnace-validation';
//import PropertyValidator from 'furnace-validation/validators/property';
//import ObjectValidator from 'furnace-validation/validators/object';

var App;
var Store;
 
module('Observer tests', {
	setup: function() {
		App = startApp();
		Store=App.getContainer().lookup('store:main');
	},
	teardown: function() {
		Ember.run(App, App.destroy);
	}
});

test("Single model", function( ) {
	var Model,Validator,Observer,Target=Ember.Object.create({'model': null}),Result;
	
	Ember.run(function() {
		Model=Store.createRecord('person',{firstName: 'Adrian',
											lastName: ''});
	});
	
	Validator=Model.validatorFor();
	
	Validator.observe(Target,'model',function(result){
		Result=result;
	});

	
	andThen(function() {
		Target.set('model',Model);
	});
	andThen(function() {
		ok(!Result.isValid(),'Check invalid');
	});
	andThen(function() {
		Model.set('lastName','Anderson');
	});
	andThen(function() {
		ok(Result.isValid(),'Check valid');
	}); 
});

test("Nested models", function( ) {
	var Model,Model2,Validator,Observer,Target=Ember.Object.create({'model': null}),Result;
	Ember.run(function() {
		Model=Store.createRecord('person',{firstName: 'Adrian',
											lastName: 'Anderson'});
		Model2=Store.createRecord('address',{street: 'A street',
											zipcode: 'AA',
											city:''});
		
		Model.set('address',Model2);
	});

	
	Validator=Model.validatorFor();
	
	Validator.observe(Target,'model',function(result){
		Result=result;
	});
	
	andThen(function() {
		Target.set('model',Model);
	});
	andThen(function() {
		ok(!Result.isValid(),'Check invalid');
	});
	andThen(function(){
		Model2.set('city','Addison');
	});
	andThen(function() {
		ok(Result.isValid(),'Check valid');
	}); 
});

test("Nested models with circular reference", function( ) {
	var Model,Model2,Validator,Observer,Target=Ember.Object.create({'model': null}),Result;
	
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
	
	Validator.observe(Target,'model',function(result){
		Result=result;
	});
	
	andThen(function() {
		Target.set('model',Model);
	});
	andThen(function() {
		ok(!Result.isValid(),'Check invalid');
	}); 
	andThen(function(){
		Model2.set('lastName','Brooks');
	}); 
	andThen(function() {
		ok(Result.isValid(),'Check valid');
	}); 
});


test("Nested models in a list", function( ) {
	var Model,Model2,Validator,Observer,Target=Ember.Object.create({'model': null}),Result;
	Ember.run(function() {
		Model=Store.createRecord('person',{firstName: 'Adrian',
											lastName: 'Anderson'});
		Model2=Store.createRecord('person',{firstName: 'Brian',
											lastName: ''});
				
		Model.get('friends').pushObject(Model2);
	});

	Validator=Model.validatorFor();

	Validator.observe(Target,'model',function(result){
		Result=result;
	});
	
	andThen(function() {
		Target.set('model',Model);
	});
	andThen(function() {
		ok(!Result.isValid(),'Check invalid');
	}); 
	andThen(function() {
		Model2.set('lastName','Brooks');
	});
	andThen(function() {
		ok(Result.isValid(),'Check valid');
	}); 
	
	andThen(function() {
		Model2.set('lastName','');
	});
	andThen(function() {
		ok(!Result.isValid(),'Check invalid');
	}); 
	
});

test("Nested models in a list with circular reference", function( ) {
	var Model,Model2,Validator,Observer,Target=Ember.Object.create({'model': null}),Result;
	Ember.run(function() {
		Model=Store.createRecord('person',{firstName: 'Adrian',
											lastName: 'Anderson'});
		Model2=Store.createRecord('person',{firstName: 'Brian',
											lastName: '',
											});
		
		Model.get('friends').pushObject(Model2);
		Model2.get('friends').pushObject(Model);
	});

	Validator=Model.validatorFor();
	
	Validator.observe(Target,'model',function(result){
		Result=result;
	});
	
	andThen(function() {
		Target.set('model',Model);
	});
	andThen(function() {
		ok(!Result.isValid(),'Check invalid');
	}); 
	andThen(function() {
		Model2.set('lastName','Brooks');
	});
	andThen(function() {
		ok(Result.isValid(),'Check valid');
	}); 
	
	

});
