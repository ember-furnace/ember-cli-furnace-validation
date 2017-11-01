import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:lookup','Integration | Initializer | Validation Initializer', {
	integration: true
});

test('Initialize', function(assert) {
	var owner=Ember.getOwner(this);
	owner.factoryFor('initializer:furnace-validation').class.initialize(owner);
	assert.ok(Ember.getOwner(this).lookup('validator:lookup'),'Check registration');
});
