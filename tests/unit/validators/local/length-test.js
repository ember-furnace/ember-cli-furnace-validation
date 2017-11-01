import { moduleFor, test } from 'ember-qunit';
import PropertyValidator from 'furnace-validation/validators/property';

moduleFor('validator:local.length','Unit | Validator | Local/Length', {
	
});

test("Check min", function(assert) {
	var result;
	
	var Validator = this.subject({min: 2});
	
	assert.ok(Validator instanceof PropertyValidator, 'Check instance');
	result = Validator.validate(null);
	
	// Behavior has changed, check existence with required
	//equal(result.isValid(),false,'Check null invalid');
	assert.equal(result.isValid(),true,'Check null valid');
		
	result = Validator.validate(undefined);
	// Behavior has changed, check existence with required
	//equal(result.isValid(),false,'Check undefined invalid');		
	assert.equal(result.isValid(),true,'Check undefined valid');
	
	result = Validator.validate("");
	// Behavior has changed, check existence with required
	//equal(result.isValid(),false,'Check empty string invalid');		
	assert.equal(result.isValid(),true,'Check empty string valid');		
	
	result = Validator.validate(0);
	assert.equal(result.isValid(),false,'Check 0 invalid');
	assert.equal(result.getMessages().length,1,'Check messages length');
	assert.equal(result.getMessages('value')[0].message,'validation.error.stringTooShort','Check message name');
	assert.equal(result.getMessages('value')[0].attributes[0],2,'Check message attribute');
	
	result = Validator.validate(123);
	assert.equal(result.isValid(),true,'Check 123 valid');
	
	result = Validator.validate("t");
	assert.equal(result.isValid(),false,'Check short string invalid');
	
	result = Validator.validate("test");
	assert.equal(result.isValid(),true,'Check long string valid');
	
	result = Validator.validate({});
	// Behavior has changed, check existence with required
	//equal(result.isValid(),false,'Check object invalid');
	assert.equal(result.isValid(),true,'Check object valid');
	
	// Behavior has changed, check existence with required
	result = Validator.validate([]);
	assert.equal(result.isValid(),true,'Check empty array valid');
	
	result = Validator.validate([1,2]);
	assert.equal(result.isValid(),true,'Check filled array valid');
});

test("Check max", function(assert) {
	var result;
	
	var Validator = this.subject({ max : 2});

	assert.ok(Validator instanceof PropertyValidator, 'Check instance');
	
	result = Validator.validate(null);
	assert.equal(result.isValid(),true,'Check null valid');		

	result = Validator.validate(undefined);
	assert.equal(result.isValid(),true,'Check undefined valid');		
	
	result = Validator.validate("");
	assert.equal(result.isValid(),true,'Check empty string valid');		
	
	result = Validator.validate(0);
	assert.equal(result.isValid(),true,'Check 0 valid');		
	
	result = Validator.validate(123);
	assert.equal(result.isValid(),false,'Check 123 invalid');	
	assert.equal(result.getMessages().length,1,'Check messages length');		
	assert.equal(result.getMessages('value')[0].message,'validation.error.stringTooLong','Check message name');
	assert.equal(result.getMessages('value')[0].attributes[0],2,'Check message attribute');
	
	result = Validator.validate("t");
	assert.equal(result.isValid(),true,'Check short string valid');		
	
	result = Validator.validate("test");
	assert.equal(result.isValid(),false,'Check long string invalid');		
	
	result = Validator.validate({});
	assert.equal(result.isValid(),true,'Check object valid');		
	
	result = Validator.validate([]);
	assert.equal(result.isValid(),true,'Check empty array valid');		
	
	result = Validator.validate([1,2,3]);
	assert.equal(result.isValid(),false,'Check filled array invalid');		
				
});


test("Check exact", function(assert) {
	var result;
	
	var Validator = this.subject({ exact : 2});

	assert.ok(Validator instanceof PropertyValidator, 'Check instance');
	
	result = Validator.validate(null);
	// Behavior has changed, check existence with required
	//equal(result.isValid(),false,'Check null invalid');
	assert.equal(result.isValid(),true,'Check null valid');
	
	result = Validator.validate(undefined);
	// Behavior has changed, check existence with required
	//equal(result.isValid(),false,'Check undefined invalid');		
	assert.equal(result.isValid(),true,'Check undefined valid');		

	// Behavior has changed, check existence with required
	result = Validator.validate("");
	//equal(result.isValid(),false,'Check empty string invalid');
	assert.equal(result.isValid(),true,'Check empty string valid');
	
	result = Validator.validate(0);
	assert.equal(result.isValid(),false,'Check 0 invalid');		
	assert.equal(result.getMessages().length,1,'Check messages length');		
	assert.equal(result.getMessages('value')[0].message,'validation.error.stringWrongLength','Check message name');
	assert.equal(result.getMessages('value')[0].attributes[0],2,'Check message attribute');
	
	result = Validator.validate(12);
	assert.equal(result.isValid(),true,'Check 12 valid');		
	
	result = Validator.validate("t");
	assert.equal(result.isValid(),false,'Check short string invalid');		
	
	result = Validator.validate("test");
	assert.equal(result.isValid(),false,'Check long string invalid');		
	
	result = Validator.validate("te");
	assert.equal(result.isValid(),true,'Check two char string valid');		
	
	// Behavior has changed, check existence with required
	result = Validator.validate({});
	//equal(result.isValid(),false,'Check object invalid');		
	assert.equal(result.isValid(),true,'Check object valid');		
	
	// Behavior has changed, check existence with required
	result = Validator.validate([]);
	//equal(result.isValid(),false,'Check empty array invalid');		
	assert.equal(result.isValid(),true,'Check empty array valid');		
	
	result = Validator.validate([1,2]);
	assert.equal(result.isValid(),true,'Check filled array valid');		
				
});