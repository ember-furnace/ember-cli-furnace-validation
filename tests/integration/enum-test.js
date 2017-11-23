import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import startApp from '../helpers/start-app';
import EnumValidator from 'furnace-validation/validators/enum';
import LengthValidator from 'dummy/validators/local/length';
import ObjectValidator from 'furnace-validation/validators/object';
import Validation from 'furnace-validation';
var App;

moduleFor('Integration | Validator | EnumValidator', {
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

test("Check validator input types", function(assert) {
	var didAssert,validator;
	
	assert.expect(5);
	
	validator = EnumValidator.create(Ember.getOwner(this).ownerInjection());
		
	assert.ok(validator instanceof EnumValidator, 'Check instance');
	
	var orgAssert=Ember.assert;
	
	Ember.assert=function(message,test) {
		if(!test) {
			didAssert=true;
		}
	}
	
	didAssert=false;
	validator.validate([]);
	assert.ok(!didAssert,'No assertion on array validation');
	
	didAssert=false;
	validator.validate('test');
	assert.ok(didAssert,'Assertion on string validation');
	
	didAssert=false;
	validator.validate(12);
	assert.ok(didAssert,'Assertion on number validation');
	
	didAssert=false;
	validator.validate({});
	assert.ok(didAssert,'Assertion on object validation');
	
	Ember.assert=orgAssert;
});

test("Check validator with required", function(assert) {
	var validator;

	assert.expect(3);
	
	validator = EnumValidator.extend({
		_validators: {
			required:true
		},
	}).create(Ember.getOwner(this).ownerInjection());
		
	assert.ok(validator instanceof EnumValidator, 'Check instance');
	
	validator.validate([]).then(function(result) {
		assert.equal(result.isValid(),false,'Check empty array invalid');
	});
	
	validator.validate(['test']).then(function(result) {
		assert.equal(result.isValid(),true,'Check array valid');
	});

});

test("Check validator with length", function(assert) {
	var validator;

	assert.expect(4);
	
	validator = EnumValidator.extend({
		_validators: {
			length:{min:2}
		},
	}).create(Ember.getOwner(this).ownerInjection());
		
	assert.ok(validator instanceof EnumValidator, 'Check instance');
	
	validator.validate([]).then(function(result) {
		assert.equal(result.isValid(),true,'Check empty valid');
	});
	
	validator.validate(['test']).then(function(result) {
		assert.equal(result.isValid(),false,'Check length 1 invalid');
	});
	
	validator.validate(['test','test']).then(function(result) {
		assert.equal(result.isValid(),true,'Check length 2 valid');
	});

});

test("Check validator with itemValidator", function(assert) {
	var validator;

	assert.expect(4);
	
	validator = EnumValidator.extend({
		_itemValidator:LengthValidator.create({min:3})
	}).create(Ember.getOwner(this).ownerInjection());
		
	assert.ok(validator instanceof EnumValidator, 'Check instance');
	
	validator.validate([]).then(function(result) {
		assert.equal(result.isValid(),true,'Check empty array valid');
	});
	
	validator.validate(['test']).then(function(result) {
		assert.equal(result.isValid(),true,'Check array valid');
	});
	
	validator.validate(['te']).then(function(result) {
		assert.equal(result.isValid(),false,'Check array invalid');
	});

});

test("Empty enum-validator using helper", function(assert) {
	var validator = Validation.Object.extend({
		test:Validation.enum().item({
			object:true,
			required:true
		})
	}).create(Ember.getOwner(this).ownerInjection());
	
	assert.ok(validator instanceof ObjectValidator, 'Check instance');
	
	var object= Ember.Object.create({ test : [] });
	
	validator.validate(object).then(function(result) {
		assert.equal(result.isValid(),true,'Check empty array valid');
	});
	
	object.test.push(Ember.Object.create());
	
	validator.validate(object).then(function(result) {
		assert.equal(result.isValid(),true,'Check array with object valid');
	});
	
	object.test.push(null);
	
	validator.validate(object).then(function(result) {
		assert.equal(result.isValid(),false,'Check array with null invalid');
	});
});