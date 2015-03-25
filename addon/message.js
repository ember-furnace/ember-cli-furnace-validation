import Ember from 'ember';
/**
 * Message
 * 
 * @namespace Furnace.Validation
 * @class Message
 * @extends Ember.Object
 */
export default Ember.Object.extend({
	/**
	 * Key to which this message applies
	 * @property key
	 * @type String
	 */
	key: null,
	
	/**
	 * Name to which this message applies
	 * @property name
	 * @type String
	 */
	name: null,
	
	/**
	 * Full path to which this message applies
	 * @property path
	 * @type String
	 */
	path: null,
	
	/**
	 * Type of the message (error/warning/notice/unknown)
	 * @property type
	 * @type String
	 * @default "unknown"
	 */
	type:'unknown',
	
	/**
	 * The message text
	 * @property message
	 * @type String
	 * @default "unknown"
	 */
	message: 'unknown',
	
	/**
	 * Attributes provided by the validaton
	 * @property attributes
	 * @type Mixed
	 * @default null
	 */
	attributes: null,
	
	/**
	 * Stringvalue for the message
	 * @method toString
	 * @return {String} Returns a furnace-i18n compatible string of the message
	 */
	toString: function() {
		return 'validation.'+this.type+'.'+this.message;
	}
	
});