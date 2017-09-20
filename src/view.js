'use strict';

import * as utils from './utils';
import * as controller from './controller';

const MAIN_ELEM = document.getElementsByTagName('main')[0];
const PLACEHOLDER_IMG_URL = 'http://via.placeholder.com/75x75';
const SML_IMG_PATH = '/img/portraits/';
const CELL_CLASS = 'cell';
const CELL_GROUP_CONTAINER_CLASS = 'cell-group-container';
const CELL_GROUP_CLASS = 'cell-group';
const CELL_PARTY_CLASS_ROOT = 'cell__pty-';
const CELL_MINI_CLASS = 'cell__mini';
const TXT_BOX_CLASS = 'txtbox';
const NAME_CLASS = 'msp-name';
const LOCATION_CLASS = 'msp-location';
const PARTY_CLASS = 'msp-party';
const ROLE_CLASS = 'msp-role';
const PORT_BOX_CLASS = 'portrait-box';
const PORT_IMG_CLASS = 'portrait-img';
const MODAL_CLASS = 'modal';
const MODAL_BOX_CLASS = 'modal--box';
const MODAL_BOX_CONTENT_CLASS = 'modal--box-content';
const MODAL_CLOSE_CLASS = 'modal--close';
const MODAL_HIDDEN_CLASS = 'modal__hidden';
const MODAL_CONTENT_TEXT_BOX_CLASS = 'modal--box-txtbox';
const MODAL_PERSONAL_BOX_CLASS = 'modal--box-pbox';
const MODAL_IMG_CLASS ='modal--box-img';

const fragmentFromString = (strHTML) => {
	return document.createRange().createContextualFragment(strHTML);
}

const getDOBHTML = (msp) => {
	let birthDate = '';
	if (msp.DOB) {
		let d = msp.DOB;
		birthDate = d.getDate() +
			'/' + (d.getMonth() + 1) +
			'/' + d.getFullYear();
			return `<p>${birthDate}</p>`;
	} else return '';
};

//TODO: Many of the notes in here should not be used, use internal names instead
const getPartyRolesHTML = (msp, mspID) => {
	if (msp.partyRoles && msp.partyRoles.length > 0) {
		let partyRoles = '';
		partyRoles = msp.partyRoles.map(
			(e) => {
				return (e.officialName) ? e.officialName : e.internalName;
			})[msp.partyRoles.length - 1];

		//HACK -- For Green leaders
		if (msp.partyRoles.find((e) => {return e.internalName == 'Party Leader'}) &&
				msp.party.abbreviation === 'Green') {
			partyRoles = 'Co-Convener; ' + partyRoles;
		}
		//HACK -- For Kez/Alex (16/09/17)
		if (mspID == 3812) {
			partyRoles = 'Finance Spokesperson';
		}
		if (mspID == 5119) {
			partyRoles = 'Interim Leader; Community, Social Security and Equalities Spokesperson';
		}
			partyRoles = partyRoles.replace(/\\r\\n/, ', ');
		return `<p class="${ROLE_CLASS}">${partyRoles}</p>`;
	} else return '';
};

const getGovtRolesHTML = (msp) => {
	if (msp.govtRoles && msp.govtRoles.length > 0) {
		let govtRoles = getUniqueArray(msp.govtRoles).join(', ');
		return `<p class="${ROLE_CLASS}">${govtRoles}</p>`;
	} else return '';
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
};

const sortByRoleRank = (arr) => {
		return arr.sort((a, b) => {
			return a.roleRank - b.roleRank
	});
}

const getModalHTML = (msp, mspID) => {
	
	let DOBHTML = getDOBHTML(msp);
	let partyRolesHTML = getPartyRolesHTML(msp, mspID);
	let govtRolesHTML = getGovtRolesHTML(msp);

	let emailsHTML = '';
	if (msp.emails && msp.emails.length > 0) {
		emailsHTML = msp.emails.map((email) =>
			`<li> <a href="mailto:${email.value}">${email.type}</a></li>`
		).join('');
	}

	let websitesHTML = '';
	if (msp.websites && msp.websites.length > 0) {
		websitesHTML = msp.websites.map((website) =>
		`<li> <a href="${website.value}">${website.type}</a></li>`
		).join('');
	}

	let addressesHTML = '';
	if (msp.addresses && msp.addresses.length > 0) {
		addressesHTML = msp.addresses.map((address) =>
			`<p>
					<strong> ${address.type} Address: </strong>
					${address.street}
					${address.postCode}
					${address.region ? address.region : ''}
					${address.town}

			</p>`
		).join('');
	}

	let comRoleList = sortByRoleRank(msp.committeeRoles).map((role) =>
	`<li>
	${((role.roleName === 'Member') ? '' : role.roleName + ' &ndash;')
	.replace(/Substitute Member/g, 'Substitute')}
	${role.groupName}
	</li>`)
	.join('');
	
	let cpgRoleList = sortByRoleRank(msp.cpgRoles).map((role) =>
	`<li>
	${(role.roleName === 'Member' ? '' : role.roleName + ' &ndash;')}
	${role.groupName.replace(/Cross-Party Group in the Scottish Parliament on/g, '')}
	</li>`)
	.join('');

	return `
	<div class="${MODAL_PERSONAL_BOX_CLASS}">
	
		<img class="${MODAL_IMG_CLASS}" src="${msp.photoURL}"></img>
		
		<h3 class="${NAME_CLASS}">${msp.firstName} ${msp.lastName}</h3>
		${DOBHTML ? DOBHTML : ''}
		<p>${msp.party.name}</p>
		<p>${(msp.constit) ? msp.constit.name + ', ' : '' }${msp.region.name}</p>
		${partyRolesHTML ? partyRolesHTML : ''}
		${govtRolesHTML ? govtRolesHTML : ''}

	</div>
	
	<div class="${MODAL_CONTENT_TEXT_BOX_CLASS}">
	
		<h4>Contact</h4>

		${addressesHTML ? addressesHTML : ''}

		${emailsHTML ? emailsHTML : ''}

		${websitesHTML ? websitesHTML : ''}

		${(comRoleList && comRoleList.length > 0) ?`
		<h4>Committees</h4>
		<ul>${comRoleList}</ul>
		`: ''}
		
		${(cpgRoleList && cpgRoleList.length > 0) ? `
		<h4>Cross-Party Groups</h4>
		<ul>${cpgRoleList}</ul>
		`: ''}
		
	</div>
	`;
};

//Click function to expand, get and add additional info
const onCellClick = (mspID) => {
	return () => {
		const MODAL_ELEM = document.getElementsByClassName(MODAL_CLASS)[0];
		if (MODAL_ELEM.classList.contains(MODAL_HIDDEN_CLASS)) {

			const MODAL_BOX = document.getElementsByClassName(MODAL_BOX_CLASS)[0];
			const MODAL_BOX_CONTENT = document.getElementsByClassName(MODAL_BOX_CONTENT_CLASS)[0];
			MODAL_ELEM.classList.toggle(MODAL_HIDDEN_CLASS);

			controller.getExpandedCellData().then((mspMap) => {
				let msp = mspMap.get(mspID);
				MODAL_BOX_CONTENT.innerHTML = getModalHTML(msp, mspID);
				MODAL_BOX.appendChild(MODAL_BOX_CONTENT);
			});
		}

	};
};

const getMSPCellHTML = (msp, mspID) => {
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

	let govtRolesHTML = getGovtRolesHTML(msp);
	let isMini = (govtRolesHTML && govtRolesHTML.search('Parliamentary Liaison Officer') == -1 ?
	true : false); 
	
	let partyRolesHTML = getPartyRolesHTML(msp, mspID);
	let cellPartyClass = CELL_PARTY_CLASS_ROOT + msp.party.abbreviation;
	
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
				${(govtRolesHTML) ? govtRolesHTML : ''}
				${(partyRolesHTML) ? partyRolesHTML : ''}
			</div>
		</div>
		`;

	return MSPFragment;
}

const setupNavMenu = () => {
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

const setupModalShell = () => {
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

	MAIN_ELEM.appendChild(fragmentFromString(modalShellHTML));

	let MODAL_ELEM = document.getElementsByClassName(MODAL_CLASS)[0];
	const CLOSE_ELEM = document.getElementsByClassName(MODAL_CLOSE_CLASS)[0];
	CLOSE_ELEM.addEventListener('click', onModalClose(MODAL_ELEM));
	//Toggle hidden on during initial page load
	MODAL_ELEM.classList.toggle(MODAL_HIDDEN_CLASS); 
};

const setupPrefsBar = (date) => {
	const PREFS_BAR_CLASS ='pref-bar';
	const PREFS_FORM_ID = 'prefs-form';
	const DATE_INPUT_ID = 'date-input';
	const DATE_SUBMIT_ID = 'date-submit';
	const MIN_DATE = '1999-05-12' // Earliest data on record


	const prefsBarHTML = `
	<div class=${PREFS_BAR_CLASS}>
		<form id="${PREFS_FORM_ID}" onsubmit="return false">
			<div>
				<label for="${DATE_INPUT_ID}">Date:</label>
				<input type="date" id="${DATE_INPUT_ID}" value="${utils.dateToStr(date)}" name="${DATE_INPUT_ID}" max="${utils.dateToStr(date)}" min="${MIN_DATE}" required>
				<span class="validity"></span>
			</div>
			<div>
				<input id="${DATE_SUBMIT_ID}" type="submit">
			</div>
		</form>
	</div>
	`;

	MAIN_ELEM.appendChild(fragmentFromString(prefsBarHTML));

	const PREFS_FORM = document.getElementById(PREFS_FORM_ID);
	const DATE_INPUT = document.getElementById(DATE_INPUT_ID);
	const DATE_SUBMIT = document.getElementById(DATE_SUBMIT_ID);


	DATE_SUBMIT.addEventListener('click', (e) => {
		controller.refreshView(utils.strToDate(DATE_INPUT.value));
	});

}


export const init = (date) => {
	setupNavMenu();
	setupPrefsBar(date);
	setupModalShell();
}

export const refresh = (mspMap, groupBy) => {

	//Remove old container
	let container = document.getElementsByClassName(CELL_GROUP_CONTAINER_CLASS)[0];
	if (container)
	{
		MAIN_ELEM.removeChild(container);
	}

	//Main loop to build initial MSP cells
	let cellsHTML = '';
	mspMap.forEach((msp, mspID) => {
		cellsHTML += getMSPCellHTML(msp, mspID);
	});

	//Grouping
	let cellContainer = fragmentFromString(`<div class="${CELL_GROUP_CONTAINER_CLASS}"></div>`);

	let testGroupHTML = `
	<div class="${CELL_GROUP_CLASS}">
		${cellsHTML}
	</div>`;

	cellContainer.appendChild(fragmentFromString(testGroupHTML));

	//Refresh the actual DOM and add events
	MAIN_ELEM.appendChild(cellContainer);
	for (let i = 0; i < cellContainer.children.length; i++) {
		let cell = cellContainer.children[i];
		cell.addEventListener('click', onCellClick(Number(cell.id)));
	}

};








