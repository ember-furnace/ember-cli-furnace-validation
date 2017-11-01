 import Ember from "ember";
 import { module, test } from 'ember-qunit';
 import Validation from 'furnace-validation';
 import PropertyValidator from 'furnace-validation/validators/property';
 import ObjectValidator from 'furnace-validation/validators/object';
 
module('Unit | Module | Validator module tests', {
	
});

test("Interface", function(assert) {
	
	assert.ok(typeof Validation==='object',"Module interface not properly exported");
	assert.equal(Validation.Object,ObjectValidator,"Expected ObjectValidator class");
	assert.equal(Validation.Property,PropertyValidator,"Expected PropertyValidator class");
	assert.ok(typeof Validation.val==='function',"Expected val function");
	assert.ok(typeof Validation.enum==='function',"Expected list function");
});

test("Validator generation", function(assert) {
	
	
	var validators=Validation.val({property : true,
									object: true});
	assert.ok(validators instanceof Ember.ComputedProperty,'Check if validators register');

});