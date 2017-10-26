import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import DS from 'ember-data';
import Dummy from 'dummy/validators/dummy';

moduleFor('validator:lookup','Integration | Lookup | Lookup injection', {
	integration: true,
	setup() {
		var owner=Ember.getOwner(this);
		owner.factoryFor('initializer:furnace-validation').class.initialize(owner);
	}
});

test('Generic',function(assert) {
	var Method,Validator,Object;
	assert.expect(3);

	Object=Ember.Object.create(Ember.getOwner(this).ownerInjection());
	
	Method=Ember.getOwner(this).lookup('validator:lookup');
	
	assert.ok(typeof Method ==='function','Check for injection');
	
	assert.ok(Validator=Method.call(Object,'dummy'),'Get Dummy validator');

	assert.ok(Validator instanceof Dummy,'Check validator instance');
});
 
test('Routes', function(assert) {
	var Factory,Validator,Route;
	assert.expect(4);

	Factory=Ember.getOwner(this).factoryFor('route:dummy');
	Route=Factory.create({routeName:'dummy'});

	assert.ok(Route instanceof Ember.Route,'Initialize Dummy route');
	
	assert.ok(typeof Route.validatorFor ==='function','Check for injection');
	
	assert.ok(Validator=Route.validatorFor(Route),'Get Dummy validator');
	
	assert.ok(Validator instanceof Dummy,'Check validator instance');
});

test('Controllers', function(assert) {
	var Factory,Validator,Controller;
	assert.expect(4);

	Factory=Ember.getOwner(this).factoryFor('controller:dummy');
	Controller=Factory.create();
	
	assert.ok(Controller instanceof Ember.Controller,'Initialize Dummy controller');
	
	assert.ok(typeof Controller.validatorFor ==='function','Check for injection');
	
	assert.ok(Validator=Controller.validatorFor(Controller),'Get Dummy validator');
	
	assert.ok(Validator instanceof Dummy,'Check validator instance');

});

test('Models', function(assert) {
	var Store,Validator,Model;
	assert.expect(4);
	Ember.run(() => {
		Store=Ember.getOwner(this).lookup('service:store');
		Model=Store.createRecord('dummy');
	});
	
	assert.ok(Model instanceof DS.Model,'Initialize Dummy model');
	
	assert.ok(typeof Model.validatorFor ==='function','Check for injection');
	
	assert.ok(Validator=Model.validatorFor(Model),'Get Dummy validator');
	
	assert.ok(Validator instanceof Dummy,'Check validator instance');

});