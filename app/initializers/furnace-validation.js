import Lookup from 'furnace-validation/utils/lookup';
import Observer from 'furnace-validation/observer';
import ObserverQueue from 'furnace-validation/observer-queue';
import Validator from 'furnace-validation/validators/abstract';
import Result from 'furnace-validation/result';

export function initialize( application) {
	application.register('validator:lookup',Lookup, {instantiate:false});
	application.inject('route','validatorFor','validator:lookup');
	application.inject('model','validatorFor','validator:lookup');
	application.inject('controller','validatorFor','validator:lookup');
	if(application.LOG_VALIDATION_OBSERVER) {
		Observer.reopen({
			_debugLogging : true,
		});
	}
	if(application.LOG_VALIDATION_OBSERVER_QUEUE) {
		ObserverQueue.reopen({
			_debugLogging : true,
		});
	}
	if(application.LOG_VALIDATIONS) {
		Validator.reopen({
			_debugLogging : true,
		});
		Result.reopen({
			_debugLogging : true,
		});
	}
};

export default {
	name: 'furnace-validation',
	initialize: initialize
};
