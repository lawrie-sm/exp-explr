'use strict';

export const setupMSPBlocks = (mspMap) => {
		const PLACEHOLDER_IMG_URL = 'http://via.placeholder.com/150x150';
		
		const CELL_CLASS = 'cellBlock';
		const TXT_BOX_CLASS = 'txtbox';
		const PORT_BOX_CLASS = 'portrait-box';
		const PORT_IMG_CLASS = 'portrait-img';
		const SML_IMG_PATH = '/img/portraits/';
		const MAIN_ELEM = document.getElementsByTagName('main')[0];

		let cells = '';

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
				imgSRC = SML_IMG_PATH + imgID + '.jpg';
			} else {
				imgSRC = '#';
			}

			/*TODO:
			May want to parse the govtRole string to ensure 
			PLOs are not given the same prominence as ministers

			Will also want to clean up the overuse of "party" in 
			spokesperson roles

			*/

			let MSPFragment = `
			<div class="${CELL_CLASS}">
				<div class="${PORT_BOX_CLASS}">
					<img class="${PORT_IMG_CLASS}" src="${PLACEHOLDER_IMG_URL}" alt="${imgAlt}">
				</div>
				<div class="${TXT_BOX_CLASS}">
					<p>${(m.govtRole) ? m.govtRole : ''}</p>
					<p>${m.firstName} ${ m.lastName}</p>
					<p>${birthDate}</p>
					<p>${m.party.name}</p>
					<p>${(m.partyRole) ? m.partyRole : ''}</p>
					<p>${location}</p>
				</div>
			</div>
			`;
						
			cells = cells + MSPFragment;
			
		});
		
		MAIN_ELEM.innerHTML = cells;

	};

export const setupNavMenu = () => {
	const OPEN_CLASS = 'nav--menu__open';
	const WAS_OPENED_CLASS = 'nav--menu__was-opened';
	const WRAPPER_CLASS = 'nav--menu-wrapper';
	const MOB_WRAPPER_CLASS = 'nav--menu-mobile-wrapper';
	const WRAPPER = document.getElementsByClassName(WRAPPER_CLASS )[0];
	const BURGER = document.getElementsByClassName('nav--burger')[0];
	const DROPDOWN = document.getElementsByClassName('nav--menu')[0];
	const MEDIA_QUERY = window.matchMedia( "(min-width: 640px)" );

	//Toggle menu classes on click
	function onBurgerClick() {
		DROPDOWN.classList.toggle(OPEN_CLASS);
		if (!(DROPDOWN.classList.contains(WAS_OPENED_CLASS))) {
			DROPDOWN.classList.add(WAS_OPENED_CLASS);
		}	
	}

	//Remove menu classes if screen is large, otherwise set to closed on mobile
	function updateMenuOnScreenChange(mediaQ) {
		DROPDOWN.classList.remove(OPEN_CLASS);
		DROPDOWN.classList.remove(WAS_OPENED_CLASS);
		WRAPPER.classList.toggle(WRAPPER_CLASS , mediaQ.matches);
		WRAPPER.classList.toggle(MOB_WRAPPER_CLASS, !mediaQ.matches);
	}

	BURGER.addEventListener('click', onBurgerClick);
	MEDIA_QUERY.addListener(updateMenuOnScreenChange);
	window.onload = updateMenuOnScreenChange(MEDIA_QUERY);
};