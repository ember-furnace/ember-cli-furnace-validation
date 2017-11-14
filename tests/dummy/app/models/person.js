import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({

	firstName : DS.attr('string'),
	
	lastName : DS.attr('string'),

	age : DS.attr('number'),
	
	bestFriend : DS.belongsTo('person',{inverse: null}),
	
	friends : DS.hasMany('person',{inverse: 'friends'}),
	
	address : DS.belongsTo('address'),
	
	hobbies: Ember.computed({
		get() {
			return Ember.A();
		}
	})
});