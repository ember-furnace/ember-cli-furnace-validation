import Ember from "ember";
import { moduleFor,test } from 'ember-qunit';
import startApp from '../helpers/start-app';

var App;

moduleFor('Integration | State | Basic tests', {
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

test("States", function(assert) {
	var Model,Validator;
	Ember.run(() => {
		Model=this.store.createRecord('employee',{firstName: 'Adrian',
											lastName: ''});
	});

	Validator=Model.validatorFor();
	Validator.validate(Model).then(function(result) {
		assert.equal(result.isValid(),false,'Check invalid');
	});
	
	Model.set('lastName','Anderson');
	
	Validator.validate(Model).then(function(result) {
		assert.equal(result.isValid(),false,'Check invalid');
	});
	
	Model.set('position','Clerk');
	
	Validator.validate(Model).then(function(result) {
		assert.equal(result.isValid(),true,'Check valid');
	});
	
	Model.set('position','Manager');
	
	Validator.validate(Model).then(function(result) {
		assert.equal(result.isValid(),false,'Check invalid');
	});
	
	Model.set('picture','Some profilepic');
	
	Validator.validate(Model).then(function(result) {
		assert.equal(result.isValid(),true,'Check valid');
	});
});

