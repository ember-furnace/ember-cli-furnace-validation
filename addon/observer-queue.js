import Ember from 'ember';

export default Ember.Object.extend({
	callback : null,
	
	_debugLogging: false,
	
	_queue :  null,
	
	_running : false,
	
	length: 0,
	
	init : function() {
		this._queue=Ember.A();
	},
	
	push: function(validator,context,sender) {
		this.length++;
		this._queue.forEach(function(queued) {
			if(queued.validator===validator && queued.context.path===context.path) {
				Ember.warn('Skipping already queued path, this has not been tested');
				return;
			}
		});
		if(this._debugLogging) {
			this._logEvent('New in queue ('+this.length+')',validator.toString(),context.path);
		}
		this._queue.push({validator : validator, context: context,sender: sender});
	},
	
	
	run: function() {
		if(this._running) {
			return;
		}
		if( !this.length) {
			return;
		}
		this._running=true;
		var queue=this;
		var next=this._queue.shift();
		if(next) {
			
			next.context.result.reset(next.context,true);
			next.context.resetStack();
			next.validator._validate(next.context).then(function(result){
				result.updateValidity(next.context,true);
				queue.length--;
				queue._running=false;
				if(queue.length) {
					if(queue._debugLogging) {
						queue._logEvent('Next in queue',queue._queue.get('firstObject').sender.toString(),queue._queue.get('firstObject').context.path);
					}
					queue.run();
				}else {
					if(queue._debugLogging) {
						queue._logEvent('Queue clear, running callback',next.sender.toString(),next.context.path);
					}
					queue.callback(result,next.sender,next.context.key);
				}
			});
		}
		
	},
	
	_logEvent : function() {
		var args=arguments;
		args[0]='Validation queue: ' + arguments[0];
		Ember.Logger.info.apply(this,args);
	}
});