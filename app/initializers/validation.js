import Lookup from 'furnace-validation/utils/lookup';

export function initialize(container, application) {
	application.register('validator:lookup',Lookup, {instantiate:false});
	application.inject('route','validatorFor','validator:lookup');
	application.inject('model','validatorFor','validator:lookup');
	application.inject('controller','validatorFor','validator:lookup');
	
};

export default {
	name: 'validation',
	initialize: initialize
};
