var helper = null;
var _container;
export function setContainer(container) {
	_container=container;
};


export default function i18n(text) {
	if(helper===null) {		
		helper=_container.lookup('i18n:t')
	}
	if(helper) {
		return helper(text);
	} else {
		return text;
	}	
}