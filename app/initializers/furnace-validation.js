import Lookup from 'furnace-validation/utils/lookup';
import { setContainer } from 'furnace-validation/utils/i18n';
export function initialize(container, application) {
	setContainer(container);
	application.register('validator:lookup',Lookup, {instantiate:false});
	application.inject('route','validatorFor','validator:lookup');
	application.inject('model','validatorFor','validator:lookup');
	application.inject('controller','validatorFor','validator:lookup');
	
};

export default {
	name: 'furnace-validation',
	initialize: initialize
};
