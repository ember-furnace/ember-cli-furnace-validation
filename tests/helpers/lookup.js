import Ember from 'ember';

export default function(app,name,options) {

	var Object=Ember.Object.create({container:app.getContainer()});
		
	var Method=app.getContainer().lookup('validator:lookup');
	
	return Method.call(Object,name,options);
}