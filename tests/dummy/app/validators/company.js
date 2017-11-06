import Validation from 'furnace-validation';
export default Validation.Object.extend( {
	
	
	name: Validation.val('required'),
	
	bestFriend: Validation.val('person'),
	
	employees: Validation.enum({
	}).item('employee'),
	
	address: Validation.val('address'),
});