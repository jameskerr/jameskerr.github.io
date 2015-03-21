//= require jkerry.js

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