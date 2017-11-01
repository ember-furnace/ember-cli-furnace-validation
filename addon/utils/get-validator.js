/**
 * Lookup validator (if not a predefined static type) and create instance of the validator 
 * @namespace Furnace.Validation
 * @private
 */
import Ember from 'ember';
import ObjectValidator from '../validators/object';
import StateValidator from '../validators/state';
import PropertyValidator from '../validators/property';
import CollectionValidator from '../validators/collection';

function getValidator(validator,options) {	
	if(options) {
		if(options===true) {
			// It was indicated just to append this validator without any options.
			// By passing null we can get a cached instance.
			options=null;
		}						
	}
	var _validator;
	var owner=Ember.getOwner(this);
	switch(validator) { 
		case 'state':
			_validator=StateValidator.extend(options).create(owner.ownerInjection());
			break;
		case 'object':
			_validator=ObjectValidator.extend(options).create(owner.ownerInjection());
			break;
		case 'collection':
			_validator=CollectionValidator.extend().val(options).create(owner.ownerInjection());
			break;
		case 'property':
			_validator=PropertyValidator.extend(options).create(owner.ownerInjection());
			break;
		default:
			_validator=this.validatorFor(validator,options);
			break;
	}
	return _validator;
}

CollectionValidator.reopen({
	_getValidator:getValidator
});
export default getValidator;