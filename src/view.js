import * as utils from './utils';
import * as controller from './controller';

// TODO: Tidy up the reliance on global state here
const MAIN_ELEM = document.getElementsByTagName('main')[0];
const SML_PLACEHOLDER_IMG_URL = 'http://via.placeholder.com/75x75';
const LRG_PLACEHOLDER_IMG_URL = 'http://via.placeholder.com/250x250';
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
const GROUP_HEADER_CLASS='group-header';


const MAX_RANKS = 15;

const fragmentFromString = (strHTML) => {
  return document.createRange().createContextualFragment(strHTML);
};

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

const getPartyRolesHTML = (msp, mspID) => {

  if (msp.partyRoles && msp.partyRoles.length > 0) {
    let partyRoles = msp.partyRoles.map((e) => {
      let role = e.name.trim();
      //Co-Conveners
      if ((role === 'Party Leader') && 
(msp.party.abbreviation === 'Green' ||
msp.party.abbreviation === 'SSP' ||
msp.party.abbreviation === 'Sol')) {
        role = 'Co-Convener';
      }
      return role;
    }).join(', ');
    partyRoles = partyRoles.replace(/Party Spokesperson on /g, '');
    return `<p class="${ROLE_CLASS}">${partyRoles}</p>`;
  } else return '';
};

//TODO: Combine party/govt functions?
const getGovtRolesHTML = (msp) => {
  if (msp.govtRoles && msp.govtRoles.length > 0) {
    let govtRoles = msp.govtRoles.map((e) => {
      let role = e.name.trim();
      return role;
    }).join(', ');
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

const sortByProp = (arr, propStr) => {
  return arr.sort((a, b) => {
    let aProp = a[propStr];
    let bProp = b[propStr];
    if (aProp < bProp) return -1;
    if (aProp > bProp) return 1;
    if (aProp === bProp) return 0;
  });
};

const sortBySubProp = (arr, subPropStr, propStr) => {
  return arr.sort((a, b) => {
    let aProp = a[subPropStr][propStr];
    let bProp = b[subPropStr][propStr];
    if (aProp < bProp) return -1;
    if (aProp > bProp) return 1;
    if (aProp === bProp) return 0;
  });
};

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

  let comRoleList = sortByProp(msp.committeeRoles, 'rank').map((role) =>
    `<li>
${((role.name === 'Member') ? '' : role.name + ' &ndash;')
    .replace(/Substitute Member/g, 'Substitute')}
${role.altText}
</li>`)
    .join('');

  let cpgRoleList = sortByProp(msp.cpgRoles, 'rank').map((role) =>
    `<li>
${(role.name === 'Member' ? '' : role.name + ' &ndash;')}
${role.altText.replace(/Cross-Party Group in the Scottish Parliament on/g, '')}
</li>`)
    .join('');

  return `
<div class="${MODAL_PERSONAL_BOX_CLASS}">

<img class="${MODAL_IMG_CLASS}" src="${LRG_PLACEHOLDER_IMG_URL}"></img>

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

// Click function to expand, get and add additional info
const onCellClick = (mspID, date) => {
  return () => {
    const MODAL_ELEM = document.getElementsByClassName(MODAL_CLASS)[0];
    if (MODAL_ELEM.classList.contains(MODAL_HIDDEN_CLASS)) {

      const MODAL_BOX = document.getElementsByClassName(MODAL_BOX_CLASS)[0];
      const MODAL_BOX_CONTENT = document.getElementsByClassName(MODAL_BOX_CONTENT_CLASS)[0];
      MODAL_ELEM.classList.toggle(MODAL_HIDDEN_CLASS);

      controller.getExpandedCellData(date).then((mspMap) => {
        let msp = mspMap.get(mspID);
        MODAL_BOX_CONTENT.innerHTML = getModalHTML(msp, mspID);
        MODAL_BOX.appendChild(MODAL_BOX_CONTENT);
      });
    }

  };
};

const getMSPCellHTML = (msp, mspID, isMini, displayRole) => {
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

  let rolesHTML = '';
  if (displayRole) {
    rolesHTML = displayRole.name;
  } else {
    rolesHTML = (getGovtRolesHTML(msp)) ? getGovtRolesHTML(msp) : getPartyRolesHTML(msp, mspID);
  }

  let cellPartyClass = CELL_PARTY_CLASS_ROOT + msp.party.abbreviation;

  let MSPFragment = `
<div id="${mspID}" class="${CELL_CLASS} ${cellPartyClass} ${(isMini) ? CELL_MINI_CLASS : ''}">
<div class="${PORT_BOX_CLASS}">
<img class="${PORT_IMG_CLASS}" src="${SML_PLACEHOLDER_IMG_URL}" alt="${imgAlt}">
</div>
<div class="${TXT_BOX_CLASS}">
<h4 class="${NAME_CLASS}">${msp.firstName} ${msp.lastName}</h4>
<p>
<span class="${PARTY_CLASS}">(${msp.party.abbreviation})</span>
<span class="${LOCATION_CLASS}">(${location})</span>
</p>

${rolesHTML}

</div>
</div>
`;

  return MSPFragment;
};

const getMSPRanking = (msp, arr) => {
  let rankArr = [];

  if (!arr)
  {

    if (msp.partyRoles.length > 0) {
      rankArr = msp.partyRoles;
    }
    if (msp.govtRoles.length > 0) {
      rankArr = msp.govtRoles;
    }
    if (rankArr.length < 1) {
      return 20;
    }
  } else {
    if (arr.length > 0) {
      rankArr = arr;
    }
    else return 20;
  }

  let topRankedRole = sortByProp(rankArr, 'rank')[0];
  return topRankedRole.rank;
};

const getCellContainerHTML = (mspMap, groups) => {
  let cellContainer = document.createElement("div");	
  cellContainer.classList.add(CELL_GROUP_CONTAINER_CLASS);
  groups.forEach((g) => {
    let sortedArray = [];
    for (let i = 0; i < MAX_RANKS; i++) {
      let rankArr = [];
      g.msps.forEach((e) => {
        if (e.ranking === i) {
          rankArr.push(e);
        }
      });
      if (rankArr.length > 0) {
        rankArr = sortBySubProp(rankArr, 'msp', 'lastName');
        sortedArray = sortedArray.concat(rankArr);
      }
    }
    let groupElem = document.createElement("div");	
    groupElem.classList.add(CELL_GROUP_CLASS);
    let cellsHTML = '';
    sortedArray.forEach((o) => {
      let isMini = (o.ranking <= 3);
      cellsHTML += getMSPCellHTML(o.msp, o.mspID, isMini, o.displayRole);
    });
    groupElem.innerHTML = cellsHTML;

    let header = document.createElement('h4');
    header.classList.add(GROUP_HEADER_CLASS);
    header.innerHTML = g.name;
    cellContainer.appendChild(header);
    cellContainer.appendChild(groupElem);
  });
  return cellContainer;
};

const getPartyGroupCells = (mspMap) => {
  let groups  = [];
  mspMap.forEach((msp, mspID) => {
    let group = groups.find((e) => {return (e.name === msp.party.abbreviation); });
    if (group) {
      group.msps.push({
        "mspID": mspID,
        "msp": msp,
        "ranking": getMSPRanking(msp)});
    }
    else {
      groups.push({"name": msp.party.abbreviation, "msps": []});
      let newGroup = groups[groups.length - 1];
      newGroup.msps.push({
        "mspID": mspID,
        "msp": msp,
        "ranking": getMSPRanking(msp)});
    }
  });
  groups.sort ((a, b) => { return b.msps.length > a.msps.length; });
  return getCellContainerHTML(mspMap, groups);
};

const getRoleGroupCells = (mspMap, groupBy) => {

  let arrStr = '';
  if (groupBy === 'committee') { arrStr = 'committeeRoles'; }
  if (groupBy === 'cpg') {arrStr = 'cpgRoles'; }

  let groups  = [];

  mspMap.forEach((msp, mspID) => {
    let roles = msp[arrStr];

    if (roles.length > 0) {
      roles.forEach((role) => {

        let group = groups.find ((e) => {
          return (e.name === role.altText);
        });
        if (group) {
          group.msps.push({
            "mspID": mspID,
            "msp": msp,
            "ranking": getMSPRanking(msp, roles),
            "displayRole": role
          });
        }
        else {
          groups.push({"name": role.altText, "msps": []});
          let newGroup = groups[groups.length - 1];
          newGroup.msps.push({
            "mspID": mspID,
            "msp": msp,
            "ranking": getMSPRanking(msp, roles),
            "displayRole": role
          });
        }

      });
    }

  });

  groups.sort ((a, b) => { return b.msps.length > a.msps.length; });
  return getCellContainerHTML(mspMap, groups);
};

const getGroupedCellContainer = (mspMap, groupBy, date) => {
  return new Promise((resolve, reject) => {
    if (groupBy === 'party') {
      resolve(getPartyGroupCells(mspMap));
    }
    if (groupBy === 'committee' || groupBy === 'cpg') {
      controller.getExpandedCellData(date).then((expandedMspMap) => {
        resolve(getRoleGroupCells(expandedMspMap, groupBy));
      });
    }
  });
};

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
    };
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
  const PREFS_FORM_ID = 'pref-form';
  const DATE_INPUT_ID = 'date-input';
  const SUBMIT_ID = 'pref-submit';
  const MIN_DATE = '1999-05-12'; // Earliest data on record
  const GROUP_BY_SELECT_ID = "group-by";
  const GROUP_SELECT_ID = "group";

  const prefsBarHTML = `
<div class=${PREFS_BAR_CLASS}>
<form id="${PREFS_FORM_ID}" onsubmit="return false">
<div>
<label for="${DATE_INPUT_ID}">Date:</label>
<input type="date" id="${DATE_INPUT_ID}" value="${utils.dateToStr(date)}" name="${DATE_INPUT_ID}" max="${utils.dateToStr(date)}" min="${MIN_DATE}" required>
<span class="validity"></span>
</div>

</form>
</div>
`;

  MAIN_ELEM.appendChild(fragmentFromString(prefsBarHTML));

  const PREFS_FORM = document.getElementById(PREFS_FORM_ID);
  const DATE_INPUT = document.getElementById(DATE_INPUT_ID);
  const GROUP_BY = document.getElementById(GROUP_BY_SELECT_ID);
  PREFS_FORM.addEventListener('change', (e) => {
    controller.refreshView(utils.strToDate(DATE_INPUT.value), GROUP_BY.value);
  });

};

export const init = (date) => {
  setupNavMenu();
  setupPrefsBar(date);
  setupModalShell();
};

export const refreshCells = (mspMap, date, groupBy) => {

//Remove old container
  let container = document.getElementsByClassName(CELL_GROUP_CONTAINER_CLASS)[0];
  if (container) { MAIN_ELEM.removeChild(container); }

  //Need to access cellcontainer async b/c it might need expanded data
  getGroupedCellContainer(mspMap, groupBy, date).then((cellContainer) => {
    //Refresh the actual DOM and add events to cells
    MAIN_ELEM.appendChild(cellContainer);
    let cells = document.getElementsByClassName(CELL_CLASS);
    for (let i = 0; i < cells.length; i++) {
      cells[i].addEventListener('click', onCellClick(Number(cells[i].id), date));
    }
  });
};