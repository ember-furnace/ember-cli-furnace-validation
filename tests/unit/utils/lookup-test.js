 import Ember from "ember";
 import DS from "ember-data";
 import { test } from 'ember-qunit';
 import startApp from '../../helpers/start-app';
 import lookup from '../../helpers/lookup';
 import ObjectValidator from 'furnace-validation/validators/object';
 import Dummy from 'dummy/validators/dummy';
 var App;
 module('Validation lookup tests', {
	setup: function() {
		App = startApp();
		
		
 	},
	teardown: function() {
		Ember.run(App, App.destroy);
	}
	
});

test('Generic',function() {
	var Method,Validator,Object;
	
	expect(3);
	
	Object=Ember.Object.create({container:App.getContainer()});
	
	Method=App.getContainer().lookup('validator:lookup');
	
	ok(typeof Method ==='function','Check for injection');
	
	ok(Validator=Method.call(Object,'dummy'),'Get Dummy validator');
	
	ok(Validator instanceof Dummy,'Check validator instance');
});
 
test('Routes', function() {
	var Factory,Validator,Route;
	expect(4);
	Factory=App.getContainer().lookupFactory('route:dummy');
	Route=Factory.create({routeName:'dummy'});

	ok(Route instanceof Ember.Route,'Initialize Dummy route');
	
	ok(typeof Route.validatorFor ==='function','Check for injection');
	
	ok(Validator=Route.validatorFor(Route),'Get Dummy validator');
	
	ok(Validator instanceof Dummy,'Check validator instance');

});

test('Controllers', function() {
	var Factory,Validator,Controller;
	expect(4);
	Factory=App.getContainer().lookupFactory('controller:dummy');
	Controller=Factory.create();
	
	ok(Controller instanceof Ember.Controller,'Initialize Dummy controller');
	
	ok(typeof Controller.validatorFor ==='function','Check for injection');
	
	ok(Validator=Controller.validatorFor(Controller),'Get Dummy validator');
	
	ok(Validator instanceof Dummy,'Check validator instance');

});

test('Models', function() {
	var Store,Validator,Model;
	expect(4);
	Ember.run(function() {
		Store=App.getContainer().lookup('store:main');
		Model=Store.createRecord('dummy');
	});
	
	ok(Model instanceof DS.Model,'Initialize Dummy model');
	
	ok(typeof Model.validatorFor ==='function','Check for injection');
	
	ok(Validator=Model.validatorFor(Model),'Get Dummy validator');
	
	ok(Validator instanceof Dummy,'Check validator instance');

});