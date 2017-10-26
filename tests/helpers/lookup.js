import Ember from 'ember';

export default function(app,name,options) {

	var Object=Ember.Object.create(Ember.getOwner(app).ownerInjection());
		
	var Method=Ember.getOwner(app).lookup('validator:lookup');
	
	return Method.call(Object,name,options);
}