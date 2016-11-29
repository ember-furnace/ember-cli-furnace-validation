import Ember from 'ember';

var Cache={classes : {},instances:{}};

var getClass=function(owner,name) {
	var Class=Cache.classes[name];
	if(!Class) {
		Class = owner._lookupFactory('validator:'+name);
		if(!Class) {
			var Local=owner._lookupFactory('validator:local.'+name);
			var Remote=owner._lookupFactory('validator:remote.'+name);

			Ember.assert('Both local and remote validator for '+name+', this has not been implemented yet!',!(Local && Remote));
			
			if(Local) {
				Class=Local;
			} else if(Remote) {
				Class=Remote;
			} else {
				Ember.warn('No validator for '+name);
				return null;
			}
		}
		Cache.classes[name]=Class;
	}
	return Class;
};

var getInstance=function(owner,name,options) {
	var Instance,Class=getClass(owner,name);
	if(Class===null) {
		return null;
	}
	// If we get options, the validator is uniquely configured for its context so create a new instance
	if(options) {
		 Instance=Class.create(owner.ownerInjection(),options);
	} else {
		Instance=Cache.instances[name];
		if(!Instance) {
			Instance=Class.create(owner.ownerInjection());
			Cache.instances[name]=Instance;
		}		
	}
	return Instance;
};

var getName=function(owner,object) {
	var objectName=null;
	
	if(typeof object === 'string') {
		objectName=object;
	}
	else if(object instanceof Ember.Route) {
		objectName=object.routeName;
	}
	else if(Ember.ControllerMixin.detect(object)) {
		var tmpName = object.constructor.toString();
		var index=tmpName.indexOf(':');
		objectName=tmpName.substring(index+1,tmpName.indexOf(':',index+1)).replace(/\//g,'.');	
	} else if(object instanceof Ember.Object) {
		if(object.constructor.modelName!==undefined) {
			objectName=object.constructor.modelName;
		} else {
			objectName=object.constructor.typeKey;
		}
	} else {
		Ember.assert('Can not determine validator for type '+(typeof object));
	}
	
	
	Ember.assert('Unable to determine validator for type '+(typeof object),objectName);

	return objectName;
};

export default function(object,options) {
	if(object===undefined) {
		object=this;
	}	
	var owner=Ember.getOwner(this);
	var name=getName(owner,object);
	return getInstance(owner,name,options);
}
	