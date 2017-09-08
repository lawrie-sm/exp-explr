'use strict';

export const setView = (mspMap) => {
		const PLACEHOLDER_IMG_URL = 'http://via.placeholder.com/150x150';
		
		const colsClass = 'cols';
		const cellClass = 'cols--cell';
		const txtBoxClass = 'txtbox';
		const portraitBoxClass = 'portrait-box';
		const portraitImgClass = 'portrait-img';
		const smallImgPath = '/img/portraits/';
		
		const main = document.getElementsByTagName('main')[0];
		let frag = document.createDocumentFragment();
		
		const E = (tag, attrs = {}, text = '', ...children) => {
			const e = document.createElement(tag);
			if (attrs) {
				for (let key in attrs) {
					e.setAttribute(key, attrs[key]);
				}
			}
			if (text) {
				e.appendChild(document.createTextNode(text));
			}
			for (let i = 0; i < children.length; i++) {
				e.appendChild(children[i]);
			}
			return e;
		};

		mspMap.forEach((m) => {
			let location;
			if (m.constit) {
				location = m.constit.name + ', ' + m.region.name;
			} else {
				location = m.region.name;
			}
			
			let birthDate = '(Birth date not given)';
			if (m.DOB) {
				let d = m.DOB;
				birthDate = d.getDate() +
					'/' + (d.getMonth() + 1) +
					'/' + d.getFullYear();
			}
			
			let imgSRC = m.photoURL;
			let imgAlt = m.firstName + ' portrait';
			if (imgSRC) {
				let imgID = imgSRC.substring(imgSRC.lastIndexOf('/') + 1);
				imgID = imgID.replace(/\s+/g, '');
				imgSRC = smallImgPath + imgID + '.jpg';
			} else {
				imgSRC = '#';
			}

			let MSPComponent = E('div', {
					'class': colsClass
				}, '',
				E('div', {
						'class': cellClass
					}, '',
					E('div', {
							'class': portraitBoxClass
						}, '',
						E('img', {
							'class': portraitImgClass,
							'src': PLACEHOLDER_IMG_URL, //imgSRC,
							'alt': imgAlt
						})),
					E('div', {
							'class': txtBoxClass
						}, '',
						E('p', {}, m.firstName + ' ' + m.lastName),
						E('p', {}, birthDate),
						E('p', {}, m.party.name),
						E('p', {}, location)
					)));
			frag.appendChild(MSPComponent);
		});
		main.appendChild(frag);
	}

export const setupNavMenu = () => {
	const openClass = 'nav--menu__open';
	const wasOpenedClass = 'nav--menu__was-opened';
	const wrapperClass = 'nav--menu-wrapper';
	const mobileWrapperClass = 'nav--menu-mobile-wrapper';
	const wrapper = document.getElementsByClassName(wrapperClass)[0];
	const burger = document.getElementsByClassName('nav--burger')[0];
	const dropdown = document.getElementsByClassName('nav--menu')[0];
	var mediaQ = window.matchMedia( "(min-width: 640px)" );

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

	burger.addEventListener('click', onBurgerClick);
	mediaQ.addListener(updateMenuOnScreenChange);
	window.onload = updateMenuOnScreenChange(mediaQ);
}