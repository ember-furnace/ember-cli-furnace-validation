import { moduleFor, test } from 'ember-qunit';
import PropertyValidator from 'furnace-validation/validators/property';

moduleFor('validator:local.absent','Unit | Validator | Local/Absent', {
});

test("Check default", function(assert) {
	var result;
	
	var Validator = this.subject();
	
	assert.ok(Validator instanceof PropertyValidator, 'Check instance');
	
	result = Validator.validate(null);
	assert.equal(result.isValid(),true,'Check null valid');	
	assert.ok(result.getMessages().length===0,'Check messages length');
	
	result = Validator.validate(undefined);
	assert.equal(result.isValid(),true,'Check undefined valid');		
	
	result = Validator.validate("");
	assert.equal(result.isValid(),true,'Check empty string valid');		
	
	result = Validator.validate(0);
	assert.equal(result.isValid(),false,'Check 0 invalid');
	assert.equal(result.getMessages().length,1,'Check messages length');		
	assert.equal(result.getMessages('value')[0].message,'validation.error.present','Check message name');
	
	result = result = Validator.validate("test");
	assert.equal(result.isValid(),false,'Check string invalid');		
	
	result = Validator.validate({});
	assert.equal(result.isValid(),false,'Check object invalid');		
});