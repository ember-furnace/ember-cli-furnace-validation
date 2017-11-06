import DS from 'ember-data';
export default DS.Model.extend({

	name : DS.attr('string'),
	
	employees : DS.hasMany('employee',{inverse: 'employer'}),
	
});