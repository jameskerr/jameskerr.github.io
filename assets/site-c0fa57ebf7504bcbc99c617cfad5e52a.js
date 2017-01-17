
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

var nav_menu = K.findById('nav-menu');
var nav      = K.query('.site-header .site-nav')[0];
var overlay  = K.findById('drawer-overlay');

var openNavMenu = function(e) {
	e.preventDefault();
	K.addClass(nav, 'site-nav__open');
	K.addClass(overlay, 'drawer-overlay__on');
	K.addClass(document.body, 'no-scroll')
};

var closeNavMenu = function(e) {
	e.preventDefault();
	K.removeClass(nav, 'site-nav__open');
	K.removeClass(overlay, 'drawer-overlay__on');
	K.removeClass(document.body, 'no-scroll')
};

nav_menu.addEventListener('touchstart', openNavMenu);
nav_menu.addEventListener('click', openNavMenu);
overlay.addEventListener('touchstart', closeNavMenu);
overlay.addEventListener('click', closeNavMenu);
