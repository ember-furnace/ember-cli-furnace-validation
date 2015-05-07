import Ember from 'ember';

export default Ember.Object.extend({
	callback : null,
	
	_queue :  null,
	
	_running : false,
	
	length: 0,
	
	init : function() {
		this._queue=Ember.A();
	},
	
	push: function(validator,context,sender) {
		this.length++;
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
			this.length--;
			
			next.context.result.reset(next.context,true);
			next.context.resetStack();
			
			next.validator._validate(next.context).then(function(result){
				result.updateValidity(next.context,true);
				queue._running=false;
				if(queue.length)
					queue.run();
				else
					queue.callback(result,next.sender,next.context.key);
			});
		}
		
	}
});