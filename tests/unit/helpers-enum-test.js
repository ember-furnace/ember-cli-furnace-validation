 import Ember from "ember";
 import { module, test } from 'ember-qunit';
 import Validation from 'furnace-validation';
 
module('Unit | Helpers | Enum tests', {
	
});


test("Enum without validation or itemValidators", function(assert) {
	
	var property=Validation.enum();
	
	assert.ok(property instanceof Ember.ComputedProperty,'Got property');

	assert.ok(!(property._meta.validators instanceof Array),'Meta validators not array');
	
	assert.equal(typeof property._meta.validators,'object','Meta validators object');
	
	assert.equal(property._meta.itemValidator,undefined,'Meta itemValidator not defined');
	
});

test("Enum without validation with itemValidator", function(assert) {
	
	var property=Validation.enum().item('required');
	
	assert.ok(property instanceof Ember.ComputedProperty,'Got property');

	assert.ok(!(property._meta.validators instanceof Array),'Meta validators not array');
	
	assert.equal(typeof property._meta.validators,'object','Meta validators object');
	
	assert.ok(!(property._meta.itemValidator instanceof Array),'Meta itemValidator not array');
	
	assert.equal(typeof property._meta.itemValidator,'object','Meta itemValidator object');
});

test("Enum with validation and itemValidator", function(assert) {
	
	var property=Validation.enum({
		required:true,
		length: {
			min:1
		}
	}).item('required');
	
	assert.ok(property instanceof Ember.ComputedProperty,'Got property');

	assert.equal(typeof property._meta.validators,'object','Meta validators object');
	
	assert.ok(!(property._meta.itemValidator instanceof Array),'Meta itemValidator not array');
	
	assert.equal(typeof property._meta.itemValidator,'object','Meta itemValidator object');
});