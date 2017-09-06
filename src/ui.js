'use strict';

//Menu code
const openClass = 'nav--menu__open';
const wasOpenedClass = 'nav--menu__was-opened';
const wrapperClass = 'nav--menu-wrapper';
const mobileWrapperClass = 'nav--menu-mobile-wrapper';

const wrapper = document.getElementsByClassName(wrapperClass)[0];
const burger = document.getElementsByClassName('nav--burger')[0];
const dropdown = document.getElementsByClassName('nav--menu')[0];


var mediaQ = window.matchMedia( "(min-width: 640px)" );

burger.addEventListener('click', onBurgerClick);

mediaQ.addListener(updateMenuOnScreenChange);

//Toggle menu classes on click
function onBurgerClick() {
	dropdown.classList.toggle(openClass);
	
	if (!(dropdown.classList.contains(wasOpenedClass))) {
		dropdown.classList.add(wasOpenedClass);
	}	
}

//Remove menu classes if screen is large, otherwise set to closed on mobile
function updateMenuOnScreenChange(mediaQ) {
	
	dropdown.classList.remove(openClass);
	dropdown.classList.remove(wasOpenedClass);
	
	wrapper.classList.toggle(wrapperClass, mediaQ.matches);
	wrapper.classList.toggle(mobileWrapperClass, !mediaQ.matches);
}

//Handle window loads
window.onload = updateMenuOnScreenChange(mediaQ);
