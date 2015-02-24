import Validation from 'furnace-validation';
export default Validation.Object.extend( {
	
	street: Validation.val('required'),
	
	zipcode: Validation.val('required'),
	
	city: Validation.val('required'),
	
	
});