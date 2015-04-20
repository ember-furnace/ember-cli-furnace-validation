import Validation from 'furnace-validation';
export default Validation.State.extend({
	'person' : Validation.val('person'),
	'employee' : Validation.object({
		position: Validation.val('required')
	}),
	'manager' : Validation.object({
		picture: Validation.val('required')
	})
	
}).cond(function(object) {
	if(object===null)
		return [];
	switch(object.get('position')) {
	case 'Manager':
		return ['person','employee','manager'];
	default:
		return ['person','employee'];
	}
},'position');