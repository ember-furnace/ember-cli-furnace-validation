import Ember from 'ember';
import { module, test } from 'ember-qunit';
import ObjectValidator from 'furnace-validation/validators/object';

module('Unit | Validator | ObjectValidator', {
});

test("Check validator", function(assert) {
	assert.expect(6);
	var Validator = ObjectValidator.create();
	
	assert.ok(Validator instanceof ObjectValidator, 'Check instance');
	
	Validator.validate("test").then(function(result) {
		assert.equal(result.isValid(),false,'Check "string" invalid');		
	});
	
	Validator.validate({}).then(function(result) {
		assert.equal(result.isValid(),false,'Check "object" invalid');		
	});
	
	Validator.validate(Ember.Object.create()).then(function(result) {
		assert.equal(result.isValid(),true,'Check "Ember.Object" valid');		
	});
	
	Validator.set('typeCheck',ObjectValidator);
	
	Validator.validate(Ember.Object.create()).then(function(result) {
		assert.equal(result.isValid(),false,'Check "TypeCheck" invalid');		
	});
	Validator.validate(Validator).then(function(result) {
		assert.equal(result.isValid(),true,'Check "TypeCheck" valid');		
	});
});