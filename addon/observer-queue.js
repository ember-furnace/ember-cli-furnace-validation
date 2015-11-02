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
		var skip=false;
		this._queue.forEach(function(queued) {
			if(queued.validator===validator && queued.context.path===context.path) {
				if(this._debugLogging) {
					this._logEvent(this+': Skipping',validator.toString(),context.path);
				}	
				skip=true;
				return;
			}
		},this);
		if(skip) {
			this.length--;
			return;
		}
		if(this._debugLogging) {
			this._logEvent(this+': New in queue ('+this.length+')',validator.toString(),context.path);
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
		var next=this._queue[0];
		if(next) {
			if(queue._debugLogging) {
				queue._logEvent(this+': Running ',next.validator.toString(),next.context.path);
			}
			next.context.result.reset(next.context,true);
			next.context.resetStack();
			next.validator._validate(next.context).then(function(result){
				queue._queue.shift();
				result.updateValidity(next.context,true);
				queue.length--;
				queue._running=false;
				if(queue.length) {
					if(queue._debugLogging) {
						queue._logEvent(queue+': Next in queue',queue._queue.get('firstObject').validator.toString(),queue._queue.get('firstObject').context.path);
					}
					queue.run();
				}else {
					if(queue._debugLogging) {
						queue._logEvent(queue+': Queue clear, running callback',next.sender.toString(),next.context.path);
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