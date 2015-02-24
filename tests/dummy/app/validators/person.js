import Validation from 'furnace-validation';
export default Validation.Object.extend( {
	
	firstName: Validation.val('required'),
	
	lastName: Validation.val('required'),
	
	bestFriend: Validation.val('person'),
	
	friends: Validation.enum().val('person'),
	
	address: Validation.val('address'),
});