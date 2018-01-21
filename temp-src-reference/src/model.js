

import * as utils from './utils';
import * as objs from './objs';
import * as http from './http';

// TODO: Won't need these once we have proper caching
let basic_data_cache = null;
let expanded_data_cache = null;
let msp_map = null;

const dateIsWithinRangeOfSPObj = (date, spObj) => {
  const startDate = utils.strToDate(spObj.ValidFromDate);
  const endDate = (spObj.ValidUntilDate != null) ?
    utils.strToDate(spObj.ValidUntilDate) : null;
  return ((date >= startDate && date <= endDate) ||
		(date >= startDate && endDate == null));
};

const byProp = (typeToCheckStr, valueToFind, date) => {
  if (date) {
    return e => (e[typeToCheckStr] === valueToFind &&
				dateIsWithinRangeOfSPObj(date, e));
  }
  return e => e[typeToCheckStr] === valueToFind;
};

const getRoleRank = (roleName) => {
  // PLOs
  if (roleName.includes('Parliamentary Liaison Officer')) {
    return 9;
  }

  // Government
  if (roleName.includes('Deputy First Minister')) {
    return 1;
  }
  if (roleName.includes('First Minister')) {
    return 0;
  }
  if (roleName.includes('Minister')) {
    return 3;
  }
  if (roleName.includes('Cabinet Secretary')) {
    return 2;
  }

  // Party
  if (roleName.includes('Deputy Party Spokesperson on') ||
	roleName.includes('Deputy Whip')) {
    return 8;
  }
  if (roleName.includes('Party Spokesperson on') ||
	roleName.includes('Chief Whip')) {
    return 7;
  }
  if (roleName.includes('Deputy Party Leader')) {
    return 6;
  }
  if (roleName.includes('Party Leader')) {
    return 5;
  }

  // Committee/CPG
  if (roleName === 'Substitute Member') {
    return 13;
  }
  if (roleName === 'Member') {
    return 12;
  }
  if (roleName === 'Deputy Convener') {
    return 11;
  }
  if (roleName === 'Co-Convener') {
    return 10;
  }
  if (roleName === 'Convener') {
    return 9;
  }

  return 15;
};

const processRoleData = (date, mspMap, arr, roleTypeArr, roleIDStr, groupArr, groupIDStr, destArrStr) => {
  arr.forEach((roleObj) => {
    const msp = mspMap.get(roleObj.PersonID);
    if (msp && dateIsWithinRangeOfSPObj(date, roleObj)) {
      const role = roleTypeArr.find(byProp('ID', roleObj[roleIDStr]));
      const roleName = utils.replaceNewlines(role.Name);
      const rank = getRoleRank(role.Name);
      if (groupArr && groupIDStr) { // Committee/CPG
        const group = groupArr.find(byProp('ID', roleObj[groupIDStr]));
        msp[destArrStr].push(new objs.Role(roleName, rank, group.Name));
      } else { // Govt
        // Check for duplicates
        const dupe = msp[destArrStr].find(e => e.name === roleName);
        if (!dupe) {
          msp[destArrStr].push(new objs.Role(roleName, rank, 'SG'));
        }
      }
    }
  });
};

const processContactData = (mspMap, arr, valTypeStr, typeArr, typeIDStr, destArr) => {
  arr.forEach((obj) => {
    const msp = mspMap.get(obj.PersonID);
    if (msp) {
      const typeStr = (typeArr.find(byProp('ID', obj[typeIDStr]))).Name;
      // Some specific code for dealing with addresses
      if (valTypeStr === 'Line1') {
        const street = `${obj.Line1}, ${obj.Line2}`;
        const objToPush = new objs.Address(typeStr, street, obj.PostCode, obj.Region, obj.Town);
        msp[destArr].push(objToPush);
      } else if (obj[valTypeStr]) {
        const objToPush = new objs.Contact(typeStr, obj[valTypeStr]);
        msp[destArr].push(objToPush);
      }
    }
  });
};

const resetMSPArrays = (mspMap) => {
  mspMap.forEach((msp) => {
    for (const prop in msp) {
      if (Array.isArray(msp[prop])
		&& prop != 'govtRoles'
		&& prop != 'partyRoles') {
        msp[prop] = [];
      }
    }
  });
};

const getMSPsByDate = (date, data) => {
  const mspMap = new Map();
  const results = data.regResults.concat(data.constitResults);

  // Add election location and initial setting of map
  results.forEach((result) => {
    if (dateIsWithinRangeOfSPObj(date, result)) {
      const msp = new objs.MSP();
      if (result.ConstituencyID) {
        const constit = data.constituencies.find(byProp('ID', result.ConstituencyID));
        msp.constit = new objs.Area(constit.Name, constit.ConstituencyCode);
        const region = data.regions.find(byProp('ID', constit.RegionID));
        msp.region = new objs.Area(region.Name, region.RegionCode);
      } else {
        const region = data.regions.find(byProp('ID', result.RegionID));
        msp.region = new objs.Area(region.Name, region.RegionCode);
      }
      mspMap.set(result.PersonID, msp);
    }
  });

  // Add basic MSP data
  data.basicMSPData.forEach((mspDataObj) => {
    const msp = mspMap.get(mspDataObj.PersonID);
    if (msp) {
      const fullName = mspDataObj.ParliamentaryName.split(',');
      msp.firstName = fullName[1];
      msp.lastName = fullName[0];
      if (!mspDataObj.BirthDateIsProtected) {
        msp.DOB = utils.strToDate(mspDataObj.BirthDate);
      }
      msp.photoURL = mspDataObj.PhotoURL;
    }
  });

  // Add party membership
  data.partyMemberships.forEach((membershipObj) => {
    const msp = mspMap.get(membershipObj.PersonID);
    if (msp && dateIsWithinRangeOfSPObj(date, membershipObj)) {
      const partyObj = data.parties.find(byProp('ID', membershipObj.PartyID));

      // Fix for Dennis Canavan
      partyObj.Abbreviation = (partyObj.Abbreviation === '*') ? 'Ind' : partyObj.Abbreviation;

      msp.party = new objs.Party(partyObj.ActualName, partyObj.Abbreviation);

      // Note use of membership ID here, to find party role
      const partyRoles = data.partyMemberRoles.filter(byProp('MemberPartyID', membershipObj.ID, date));
      if (partyRoles) {
        partyRoles.forEach((role) => {
          const partyRoleType = data.partyRoles.find(byProp('ID', role.PartyRoleTypeID));
          const roleName = partyRoleType.Name;
          const roleNotes = utils.replaceNewlines(role.Notes);
          const rank = getRoleRank(roleName);
          msp.partyRoles.push(new objs.Role(roleName, rank, roleNotes));
        });
      }
      // Fix for POs
      if (msp.party.abbreviation === 'NPA') {
        msp.partyRoles.push(new objs.Role('Presiding Officer', 0, 'Presiding Officer'));
      }
    }
  });

  // Add government roles
  processRoleData(
    date, mspMap, data.govtMemberRoles, data.govtRoles, 'GovernmentRoleID',
    '', '', 'govtRoles',
  );

  return mspMap;
};

const updateMSPMapWithExpandedData = (date, data) => {
  resetMSPArrays(msp_map);

  processRoleData(
    date, msp_map, data.membercpgRoles, data.cpgRoles,
    'CrossPartyGroupRoleID', data.cpgs, 'CrossPartyGroupID', 'cpgRoles',
  );

  processRoleData(
    date, msp_map, data.memberCommitteeRoles, data.committeeRoles,
    'CommitteeRoleID', data.committees, 'CommitteeID', 'committeeRoles',
  );

  processContactData(
    msp_map, data.addresses, 'Line1', data.addressTypes,
    'AddressTypeID', 'addresses',
  );

  processContactData(
    msp_map, data.emails, 'Address', data.emailTypes,
    'EmailAddressTypeID', 'emails',
  );

  processContactData(
    msp_map, data.telephones, 'Telephone1', data.telephoneTypes,
    'TelephoneTypeID', 'telephones',
  );

  processContactData(
    msp_map, data.websites, 'WebURL', data.websiteTypes,
    'WebSiteTypeID', 'websites',
  );
};

export const getMSPMap = date => new Promise((resolve, reject) => {
  if (!basic_data_cache) {
    http.getInitialMSPData().then((data) => {
      basic_data_cache = data;
      msp_map = getMSPsByDate(date, basic_data_cache);

      resolve(msp_map);
    });
  } else {
    msp_map = getMSPsByDate(date, basic_data_cache);
    resolve(msp_map);
  }
});

export const getExpandedMSPMap = date => new Promise((resolve, reject) => {
  if (!expanded_data_cache) {
    http.getExpandedMSPData().then((data) => {
      expanded_data_cache = data;
      updateMSPMapWithExpandedData(date, expanded_data_cache);
      resolve(msp_map);
    });
  } else {
    updateMSPMapWithExpandedData(date, expanded_data_cache);
    resolve(msp_map);
  }
});
