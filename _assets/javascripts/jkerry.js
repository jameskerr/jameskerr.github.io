
// IE 9+ Only
K = {

	addClass: function(el, class_name) {
		if (el.classList)
			el.classList.add(class_name);
		else
			el.className += ' ' + class_name;
	},

	removeClass: function(el, class_name) {
		if (el.classList)
			el.classList.remove(class_name);
		else
			el.className = el.className.replace(new RegExp('(^|\\b)' + class_name.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	},

	findById: function(id_name) {
		return document.getElementById(id_name);
	}, 

	query: function(selector) {
		return document.querySelectorAll(selector);
	}
};