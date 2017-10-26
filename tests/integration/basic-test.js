import Ember from "ember";
import {moduleFor, test } from 'ember-qunit';

moduleFor('Integration | Validation | Validator basic tests', {
	integration:true,
	setup() {
		var owner=Ember.getOwner(this);
		owner.factoryFor('initializer:furnace-validation').class.initialize(owner);
		this.inject.service('store');
	}
});

test("Single model", function(assert) {
	var Model,Validator;
	Ember.run(() => {
		Model=this.store.createRecord('person',{firstName: 'Adrian',
											lastName: ''});
	});

	Validator=Model.validatorFor();
	
	Validator.validate(Model).then(function(result) {
		assert.equal(result.isValid(),false,'Check invalid');
	}); 
	
	Model.set('lastName','Anderson');
	
	Validator.validate(Model).then(function(result) {
		assert.equal(result.isValid(),true,'Check valid');
	}); 
});

test("Nested models", function(assert) {
	var Model,Model2,Validator;
	Ember.run(() => {
		Model=this.store.createRecord('person',{firstName: 'Adrian',
											lastName: 'Anderson'});
		Model2=this.store.createRecord('address',{street: 'A street',
											zipcode: 'AA',
											city:''});
		
		Model.set('address',Model2);
	});

	Validator=Model.validatorFor();
	
	Validator.validate(Model).then(function(result) {
		assert.equal(result.isValid(),false,'Check invalid');
	}); 
	
	Model2.set('city','Addison');
	
	Validator.validate(Model).then(function(result) {
		assert.equal(result.isValid(),true,'Check valid');
	});
});

test("Nested models with circular reference", function(assert) {
	var Model,Model2,Validator;
	
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
	
	Validator.validate(Model).then(function(result) {
		assert.equal(result.isValid(),false,'Check invalid');
	}); 
	
	Model2.set('lastName','Brooks');
	
	Validator.validate(Model).then(function(result) {
		assert.equal(result.isValid(),true,'Check valid');
	});
});


test("Nested models in a list", function(assert) {
	var Model,Model2,Validator;
	Ember.run(() => {
		Model=this.store.createRecord('person',{firstName: 'Adrian',
											lastName: 'Anderson'});
		Model2=this.store.createRecord('person',{firstName: 'Brian',
											lastName: ''});
				
		Model.get('friends').pushObject(Model2);
	});
	Validator=Model.validatorFor();

	Validator.validate(Model).then(function(result) {
		assert.equal(result.isValid(),false,'Check invalid');
	}); 
	
	Ember.run(function() {
		Model2.set('lastName','Brooks');
	});
	
	Validator.validate(Model).then(function(result) {
		assert.equal(result.isValid(),true,'Check valid');
	});
	
});

test("Nested models in a list with circular reference", function(assert) {
	var Model,Model2,Validator;
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
	
	Validator.validate(Model).then(function(result) {
		assert.equal(result.isValid(),false,'Check invalid');
	}); 
	
	Ember.run(function() {
		Model2.set('lastName','Brooks');
	});
	
	Validator.validate(Model).then(function(result) {
		assert.equal(result.isValid(),true,'Check valid');
	}); 
	

});