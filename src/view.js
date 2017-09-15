'use strict';

import * as controller from './controller';

export const setupMSPBlocks = (mspMap) => {
	const PLACEHOLDER_IMG_URL = 'http://via.placeholder.com/50x50';
	const CELL_CLASS = 'cell';
	const CELL_CONTAINER_CLASS = 'cell-container';
	const CELL_PARTY_CLASS_ROOT = 'cell__pty_';
	const CELL_GOV_CLASS = 'cell__gov';
	const TXT_BOX_CLASS = 'txtbox';
	const P_NAME_CLASS = 'msp-name'
	const PORT_BOX_CLASS = 'portrait-box';
	const PORT_IMG_CLASS = 'portrait-img';
	const SML_IMG_PATH = '/img/portraits/';
	const MAIN_ELEM = document.getElementsByTagName('main')[0];
	const EXP_BOX_CLASS = 'expanded-box';
	const EXP_BOX_HIDDEN_CLASS = 'expanded-box__hidden';
	
	
	//Click function to expand, get and add additional info
	const onCellClick = (cell, msp) => {
		const setupExpBox = (cell, msp) => {
			let expFragment = `
			<div class="${EXP_BOX_CLASS}">
				<p>${(msp.addresses[0]) ? msp.addresses[0].street : null}</p>
				<p>${(msp.emails[0]) ? msp.emails[0].value : null}</p>
				<p>${(msp.websites[0]) ? msp.websites[0].value : null}</p>
			</div>
			`;
			cell.innerHTML += expFragment;
		}
		
		return () => {
			const CELL_EXPANDED_CLASS = 'cellBlock__expanded';
			let expBox = cell.getElementsByClassName(EXP_BOX_CLASS)[0];
			if (cell.classList.toggle(CELL_EXPANDED_CLASS)) {
				controller.getExpandedCellData().then((mspMap) => {
					if (!expBox) {
						expBox = setupExpBox(cell, msp);
						expBox = cell.getElementsByClassName(EXP_BOX_CLASS)
					} else {
						expBox.classList.toggle(EXP_BOX_HIDDEN_CLASS);
					}
							
				});
			} else {
				if (expBox) {
					expBox.classList.toggle(EXP_BOX_HIDDEN_CLASS);
				}
			}
		}
	}

	let cells = '';

	let cellContainer = document.createElement("div");
	cellContainer.classList.add(CELL_CONTAINER_CLASS);
	
	//Main loop to build initial MSP cells
	mspMap.forEach((msp, mspID) => {
		let location;
		if (msp.constit) {
			location = msp.constit.name + ', ' + msp.region.name;
		} else {
			location = msp.region.name;
		}

		let birthDate = '(Birth date not given)';
		if (msp.DOB) {
			let d = msp.DOB;
			birthDate = d.getDate() +
				'/' + (d.getMonth() + 1) +
				'/' + d.getFullYear();
		}

		let imgSRC = msp.photoURL;
		let imgAlt = msp.firstName + ' portrait';
		if (imgSRC) {
			let imgID = imgSRC.substring(imgSRC.lastIndexOf('/') + 1);
			imgID = imgID.replace(/\s+/g, '');
			imgSRC = SML_IMG_PATH + imgID + '.jpg';
		} else {
			imgSRC = '#';
		}

		let partyRole = '';
		if (msp.partyRoles && msp.partyRoles.length > 0) {
			partyRole = msp.partyRoles[msp.partyRoles.length - 1].officialName;
			partyRole = partyRole.replace(/\\r\\n/, ', ');
		}
		
		let cellPartyClass = CELL_PARTY_CLASS_ROOT + msp.party.abbreviation;
		let govtRoles = (msp.govtRoles) ? msp.govtRoles.join(', ') : '';
		
		let MSPFragment = `
			<div id="${mspID}" class="
			${CELL_CLASS}
			${cellPartyClass}
			${(govtRoles) ? CELL_GOV_CLASS : ''}">
				<div class="${PORT_BOX_CLASS}">
					<img class="${PORT_IMG_CLASS}" src="${PLACEHOLDER_IMG_URL}" alt="${imgAlt}">
				</div>
				<div class="${TXT_BOX_CLASS}">
					<p class="${P_NAME_CLASS}">${msp.firstName} ${ msp.lastName} (${msp.party.abbreviation})</p>
					${(govtRoles) ? '<p>' + govtRoles + '</p>' : ''}
					${(partyRole) ? '<p>' + partyRole + '</p>' : ''}
				</div>
			</div>
			`;
		cells = cells + MSPFragment;
	});

	cellContainer.innerHTML = cells;
	MAIN_ELEM.appendChild(cellContainer);
	
	for (let i = 0; i < cellContainer.children.length; i++) {
		let cell = cellContainer.children[i];
		cell.addEventListener('click', onCellClick(cell, mspMap.get(Number(cell.id))));
	}
	
};

export const setupNavMenu = () => {
	const OPEN_CLASS = 'nav--menu__open';
	const WAS_OPENED_CLASS = 'nav--menu__was-opened';
	const WRAPPER_CLASS = 'nav--menu-wrapper';
	const MOB_WRAPPER_CLASS = 'nav--menu-mobile-wrapper';
	const WRAPPER = document.getElementsByClassName(WRAPPER_CLASS)[0];
	const BURGER = document.getElementsByClassName('nav--burger')[0];
	const DROPDOWN = document.getElementsByClassName('nav--menu')[0];
	const MEDIA_QUERY = window.matchMedia("(min-width: 640px)");

	//Toggle menu classes on click
	const onBurgerClick = () => {
		return () => {
			DROPDOWN.classList.toggle(OPEN_CLASS);
			if (!(DROPDOWN.classList.contains(WAS_OPENED_CLASS))) {
				DROPDOWN.classList.add(WAS_OPENED_CLASS);
			}
		};
	};

	//Remove menu classes if screen is large, otherwise set to closed on mobile
	const updateMenuOnScreenChange = (mediaQ) => {
		return () => {
			DROPDOWN.classList.remove(OPEN_CLASS);
			DROPDOWN.classList.remove(WAS_OPENED_CLASS);
			WRAPPER.classList.toggle(WRAPPER_CLASS, mediaQ.matches);
			WRAPPER.classList.toggle(MOB_WRAPPER_CLASS, !mediaQ.matches);
		};
	};

	BURGER.addEventListener('click', onBurgerClick());
	MEDIA_QUERY.addListener(updateMenuOnScreenChange(MEDIA_QUERY));
	window.onload = updateMenuOnScreenChange(MEDIA_QUERY);
};