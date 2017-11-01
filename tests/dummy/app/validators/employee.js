import Validation from 'furnace-validation';
export default Validation.State.extend({
	'person' : Validation.val('person'),
	'employee' : Validation.object({
		position: Validation.val('required')
	}),
	'manager' : Validation.object({
		picture: Validation.val('required')
	}),
	'ignore' : Validation.val('ignore')
	
}).on('position',function(object) {
	if(object===null)
		return ['ignore'];
	switch(object.get('position')) {
	case 'Manager':
		return ['person','employee','manager'];
	default:
		return ['person','employee'];
	}
});