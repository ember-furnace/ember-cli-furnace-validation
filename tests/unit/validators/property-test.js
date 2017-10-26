import { module, test } from 'ember-qunit';
import PropertyValidator from 'furnace-validation/validators/property';

module('Unit | Validator | PropertyValidator', {
});

test("Create a validator", function(assert) {
	assert.expect(2);
	var Validator = PropertyValidator.create();
	
	assert.ok(Validator instanceof PropertyValidator, 'Check instance');
	
	// The PropertyValidator is abstract. Trying to validate with it should throw an assertion error
	try {
		Validator.validate("test");
		assert.ok(false,'Could validate');		
	}
	catch(e) {
		assert.ok(true,'Could not validate');
	}
		
});