import Ember from "ember";
import { moduleFor,test } from 'ember-qunit';
import startApp from '../helpers/start-app';
var App;
moduleFor('Integration | Observer | Basic tests', {
	integration:true,
	setup() {
		App = startApp();
		var owner=Ember.getOwner(this);
		owner.factoryFor('initializer:furnace-validation').class.initialize(owner);
		this.inject.service('store');
	},
	teardown: function() {
		Ember.run(App, 'destroy');
	}
});

test("Single model", function(assert) {
	var Model,Validator,Target=Ember.Object.create({'model': null}),Result;
	
	Ember.run(() => {
		Model=this.store.createRecord('person',{firstName: 'Adrian',
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
		assert.equal(Result.isValid(),false,'Check invalid');
	});
	andThen(function() {
		Model.set('lastName','Anderson');
	});
	andThen(function() {
		assert.equal(Result.isValid(),true,'Check valid');
	}); 
});

test("Nested models", function(assert) {
	var Model,Model2,Validator,Target=Ember.Object.create({'model': null}),Result;
	Ember.run(() => {
		Model=this.store.createRecord('person',{firstName: 'Adrian',
											lastName: 'Anderson'});
		Model2=this.store.createRecord('address',{street: 'A street',
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
		assert.equal(Result.isValid(),false,'Check invalid');
	});
	andThen(function(){
		Model2.set('city','Addison');
	});
	andThen(function() {
		assert.equal(Result.isValid(),true,'Check valid');
	}); 
});

test("Nested models with circular reference", function(assert) {
	var Model,Model2,Validator,Target=Ember.Object.create({'model': null}),Result;
	
	Ember.run(() => {
		Model=this.store.createRecord('person',{firstName: 'Adrian',
											lastName: 'Anderson'});
		Model2=this.store.createRecord('person',{firstName: 'Brian',
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
		assert.equal(Result.isValid(),false,'Check invalid');
	}); 
	andThen(function(){
		Model2.set('lastName','Brooks');
	}); 
	andThen(function() {
		assert.equal(Result.isValid(),true,'Check valid');
	}); 
});


test("Nested models in a list", function(assert) {
	var Model,Model2,Validator,Target=Ember.Object.create({'model': null}),Result;
	Ember.run(() => {
		Model=this.store.createRecord('person',{firstName: 'Adrian',
											lastName: 'Anderson'});
		Model2=this.store.createRecord('person',{firstName: 'Brian',
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
		assert.equal(Result.isValid(),true,'Check valid');
	}); 
	
	andThen(function() {
		Model.get('friends').pushObject(Model2);
	});
	andThen(function() {
		assert.equal(Result.isValid(),false,'Check invalid');
	});
//	
//	andThen(function() {
//		Model2.set('lastName','Brooks');
//	});
//	andThen(function() {
//		equal(Result.isValid(),true,'Check valid');
//	}); 
//	
//	andThen(function() {
//		Model2.set('lastName','');
//	});
//	andThen(function() {
//		equal(Result.isValid(),false,'Check invalid');
//	}); 
	
});

test("Nested models in a list with circular reference", function(assert) {
	var Model,Model2,Validator,Target=Ember.Object.create({'model': null}),Result;
	Ember.run(() => {
		Model=this.store.createRecord('person',{firstName: 'Adrian',
											lastName: 'Anderson'});
		Model2=this.store.createRecord('person',{firstName: 'Brian',
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
		assert.equal(Result.isValid(),false,'Check invalid');
	}); 
	andThen(function() {
		Model2.set('lastName','Brooks');
	});
	andThen(function() {
		assert.equal(Result.isValid(),true,'Check valid');
	}); 
	
	

});

test("States", function(assert) {
	var Model,Validator,Target=Ember.Object.create({'model': null}),Result;
	Ember.run(() => {
		Model=this.store.createRecord('employee',{firstName: 'Adrian',
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
		assert.equal(Result.isValid(),false,'Check invalid');
	}); 
	
	andThen(function() {
		Model.set('lastName','Anderson');
	});
	
	andThen(function() {
		assert.equal(Result.isValid(),false,'Check invalid');
	});
	
	andThen(function() {
		Model.set('position','Clerk');
	});
	
	andThen(function() {
		assert.equal(Result.isValid(),true,'Check valid');
	});
	
	andThen(function() {
		Model.set('position','Manager');
	});
	andThen(function() {
		assert.equal(Result.isValid(),false,'Check invalid');
	});
	andThen(function() {
		Model.set('picture','Some profilepic');
	});
	andThen(function() {
		assert.equal(Result.isValid(),true,'Check valid');
	});
	
	
	andThen(function() {
		Target.set('model',null);
	});
	
	andThen(function() {
		assert.equal(Result.isValid(),true,'Check valid');
	});
	
	andThen(function() {
		Model.set('picture','');
		Target.set('model',Model);
	});
	
	andThen(function() {
		assert.equal(Result.isValid(),false,'Check invalid');
	});
	andThen(function() {
		Model.set('picture','Some profilepic');
	});
	andThen(function() {
		assert.equal(Result.isValid(),true,'Check valid');
	});
	
});