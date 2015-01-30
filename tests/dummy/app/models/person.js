import DS from 'ember-data';
export default DS.Model.extend({

	firstName : DS.attr('string'),
	
	lastName : DS.attr('string'),

	age : DS.attr('number'),
	
	bestFriend : DS.belongsTo('person'),
	
	friends : DS.hasMany('person',{inverse: 'friends'}),
	
	address : DS.belongsTo('address'),
});