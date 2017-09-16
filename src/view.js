'use strict';

import * as controller from './controller';

const PLACEHOLDER_IMG_URL = 'http://via.placeholder.com/75x75';
const CELL_CLASS = 'cell';
const CELL_CONTAINER_CLASS = 'cell-container';
const CELL_PARTY_CLASS_ROOT = 'cell__pty-';
const CELL_MINI_CLASS = 'cell__mini';
const TXT_BOX_CLASS = 'txtbox';
const NAME_CLASS = 'msp-name';
const LOCATION_CLASS = 'msp-location';
const PARTY_CLASS = 'msp-party';
const ROLE_CLASS = 'msp-role';
const PORT_BOX_CLASS = 'portrait-box';
const PORT_IMG_CLASS = 'portrait-img';
const SML_IMG_PATH = '/img/portraits/';
const MAIN_ELEM = document.getElementsByTagName('main')[0];
const MODAL_CLASS = 'modal';
const MODAL_BOX_CLASS = 'modal-box';
const MODAL_BOX_CONTENT_CLASS = 'modal-box-content';
const MODAL_CLOSE_CLASS = 'modal-close';
const MODAL_HIDDEN_CLASS = 'modal__hidden';

/*
const getDOBStr = (msp) => {
	let birthDate = '(Birth date not given)';
	if (msp.DOB) {
		let d = msp.DOB;
		birthDate = d.getDate() +
			'/' + (d.getMonth() + 1) +
			'/' + d.getFullYear();
	}
	return birthDate;
};
*/

const getPartyRoles = (msp, mspID) => {
	let partyRoles = '';
	partyRoles = msp.partyRoles.map(
		(e) => {
			return (e.officialName) ? e.officialName : e.internalName;
		})[msp.partyRoles.length - 1];

	//HACK -- For Green leaders
	if (msp.partyRoles.find((e) => {return e.internalName == 'Party Leader'}) &&
			msp.party.abbreviation === 'Green')
		partyRoles = 'Co-Convener; ' + partyRoles;
	//HACK -- For Kez/Alex (16/09/17)
	if (mspID == 3812)
		partyRoles = 'Finance Spokesperson';
	if (mspID == 5119)
		partyRoles = 'Interim Leader; Community, Social Security and Equalities Spokesperson';

	partyRoles = partyRoles.replace(/\\r\\n/, ', ');
	return partyRoles;
};

const getLocationStr = (msp) => {
	let location = '';
	if (msp.constit) {
		location = msp.constit.name;
	} else {
		location = msp.region.name;
	}
	location = location.replace(/ and /g, ' & ');
	return location;
};

const getUniqueArray = (arr) => {
	return arr.filter((e, i, self) => {
		return self.indexOf(e) === i;
	});
}

//Click function to expand, get and add additional info
const onCellClick = (mspID) => {
	return () => {
		const MODAL_ELEM = document.getElementsByClassName(MODAL_CLASS)[0];
		const MODAL_BOX = document.getElementsByClassName(MODAL_BOX_CLASS)[0];
		const MODAL_BOX_CONTENT = document.getElementsByClassName(MODAL_BOX_CONTENT_CLASS)[0];

		MODAL_ELEM.classList.toggle(MODAL_HIDDEN_CLASS);

		//TODO: Spinner here

		controller.getExpandedCellData().then((mspMap) => {
			let msp = mspMap.get(mspID);
			MODAL_BOX_CONTENT.innerHTML = `<p>${msp.firstName}</p>`;
			MODAL_BOX.appendChild(MODAL_BOX_CONTENT);
		});
	};
};


export const setupMSPBlocks = (mspMap) => {
	let cells = '';

	let cellContainer = document.createElement("div");
	cellContainer.classList.add(CELL_CONTAINER_CLASS);
	
	//Main loop to build initial MSP cells
	mspMap.forEach((msp, mspID) => {

		let location = getLocationStr(msp);

		let imgSRC = msp.photoURL;
		let imgAlt = msp.firstName + ' portrait';
		if (imgSRC) {
			let imgID = imgSRC.substring(imgSRC.lastIndexOf('/') + 1);
			imgID = imgID.replace(/\s+/g, '');
			imgSRC = SML_IMG_PATH + imgID + '.jpg';
		} else {
			imgSRC = '#';
		}

		let partyRoles = '';
		if (msp.partyRoles && msp.partyRoles.length > 0) {
			partyRoles = getPartyRoles(msp, mspID);
		}
		let cellPartyClass = CELL_PARTY_CLASS_ROOT + msp.party.abbreviation;
		let partyRolesHTML = `<p class="${ROLE_CLASS}">${partyRoles}</p>`;
		
		let govtRoles = '';
		let isMini = false;
		if (msp.govtRoles && msp.govtRoles.length > 0) {
			govtRoles = getUniqueArray(msp.govtRoles).join(', ');
			isMini = govtRoles;
			if (govtRoles.includes('Parliamentary Liaison Officer')) {
				isMini = !isMini;
			}
		}
		let govtRolesHTML = `<p class="${ROLE_CLASS}">${govtRoles}</p>`;
		
		let MSPFragment = `
			<div id="${mspID}" class="${CELL_CLASS} ${cellPartyClass} ${(isMini) ? CELL_MINI_CLASS : ''}">
				<div class="${PORT_BOX_CLASS}">
					<img class="${PORT_IMG_CLASS}" src="${PLACEHOLDER_IMG_URL}" alt="${imgAlt}">
				</div>
				<div class="${TXT_BOX_CLASS}">
					<h4 class="${NAME_CLASS}">${msp.firstName} ${msp.lastName}</h4>
					<p>
					<span class="${PARTY_CLASS}">(${msp.party.abbreviation})</span>
					<span class="${LOCATION_CLASS}">(${location})</span>
					</p>
					${(govtRoles) ? govtRolesHTML : ''}
					${(partyRoles) ? partyRolesHTML : ''}
				</div>
			</div>
			`;
		cells = cells + MSPFragment;
	});

	cellContainer.innerHTML = cells;
	MAIN_ELEM.appendChild(cellContainer);
	
	for (let i = 0; i < cellContainer.children.length; i++) {
		let cell = cellContainer.children[i];
		cell.addEventListener('click', onCellClick(Number(cell.id)));
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
		};//
	};

	BURGER.addEventListener('click', onBurgerClick());
	MEDIA_QUERY.addListener(updateMenuOnScreenChange(MEDIA_QUERY));
	window.onload = updateMenuOnScreenChange(MEDIA_QUERY);
};

export const setupModalShell = () => {
	const onModalClose = (modal) => {
		return () => {
			modal.classList.toggle(MODAL_HIDDEN_CLASS);
		};
	};

	const modalShellHTML =`
	<div class="${MODAL_CLASS}">
		<div class="${MODAL_BOX_CLASS}">
			<div class="${MODAL_CLOSE_CLASS}">&times;</div>
			<div class ="${MODAL_BOX_CONTENT_CLASS}"><div>
		</div>
	</div>
	`;

	MAIN_ELEM.innerHTML += modalShellHTML;
	let MODAL_ELEM = document.getElementsByClassName(MODAL_CLASS)[0];
	const CLOSE_ELEM = document.getElementsByClassName(MODAL_CLOSE_CLASS)[0];
	CLOSE_ELEM.addEventListener('click', onModalClose(MODAL_ELEM));
	//Toggle hidden on during initial page load
	MODAL_ELEM.classList.toggle(MODAL_HIDDEN_CLASS); 
};