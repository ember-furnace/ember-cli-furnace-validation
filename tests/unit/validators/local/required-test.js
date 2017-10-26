import { moduleFor, test } from 'ember-qunit';
import PropertyValidator from 'furnace-validation/validators/property';

moduleFor('validator:local.required','Unit | Validator | Local/Required', {
});

test("Check validator", function(assert) {
	var result;
	var Validator = this.subject();
	
	assert.ok(Validator instanceof PropertyValidator, 'Check instance');
	
	result = Validator.validate(null);
	assert.equal(result.isValid(),false,'Check null invalid');
	assert.equal(result.getMessages().length,1,'Check messages length');		
	assert.equal(result.getMessages('value')[0],'validation.error.blank','Check message name');

	result = Validator.validate(undefined);
	assert.equal(result.isValid(),false,'Check undefined invalid');		
	
	result = Validator.validate("");
	assert.equal(result.isValid(),false,'Check empty string invalid');
	
	result = Validator.validate(false);
	assert.equal(result.isValid(),false,'Check false string invalid');		
	
	result = Validator.validate(0);
	assert.equal(result.isValid(),true,'Check 0 valid');
	assert.equal(result.getMessages().length,0,'Check messages length');	
	
	result = Validator.validate("test");
	assert.equal(result.isValid(),true,'Check string valid');		
	
	result = Validator.validate({});
	assert.equal(result.isValid(),true,'Check object valid');		
	
	result = Validator.validate(true);
	assert.equal(result.isValid(),true,'Check true valid');
});