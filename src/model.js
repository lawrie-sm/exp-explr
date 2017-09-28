'use strict';

import * as utils from './utils';
import * as objs from './objs';
import * as http from './http';

//TODO: Won't need these once we have proper caching
let basic_data_cache = null;
let expanded_data_cache = null;
let msp_map = null;

const dateIsWithinRangeOfSPObj = (date, spObj) => {	
	let startDate = utils.strToDate(spObj.ValidFromDate);
	let endDate = (spObj.ValidUntilDate != null) ?
	utils.strToDate(spObj.ValidUntilDate) : null;
	return ((date >= startDate && date <= endDate) ||
		(date >= startDate && endDate == null));
};

const byProp = (typeToCheckStr, valueToFind, date) => {
	if (date) {
		return (e) => {
			return (e[typeToCheckStr] === valueToFind &&
				dateIsWithinRangeOfSPObj(date, e));
		};
	} else {
		return (e) => {
			return e[typeToCheckStr] === valueToFind;
		};
	}
};

const getRoleRank = (roleName) => {

	//Government
	if (roleName.includes('Parliamentary Liaison Officer')) {
		return 4;
	}
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

	//Party
	if (roleName.includes('Deputy Party Spokesperson on')) {
		return 4;
	}
	if (roleName.includes('Party Spokesperson on')) {
		return 3;
	}
	if (roleName.includes('Chief Whip')) {
		return 2;
	}
	if (roleName.includes('Deputy Party Leader')) {
		return 1;
	}
	if (roleName.includes('Party Leader')) {
		return 0;
	}

	//Committee/CPG
	if (roleName === 'Convener') {
		return 0;
	}
	if (roleName === 'Co-Convener') {
		return 1;
	}
	if (roleName === 'Deputy Convener') {
		return 2;
	}
	if (roleName === 'Member') {
		return 3;
	}
	if (roleName === 'Substitute Member') {
		return 4;
	}



console.log(roleName);

	return 10;
}

const processRoleData = (
date, mspMap, arr, roleTypeArr, roleIDStr, groupArr, groupIDStr, destArrStr) => {
	arr.forEach((roleObj) => { 
		let msp = mspMap.get(roleObj.PersonID);
		if (msp && dateIsWithinRangeOfSPObj(date, roleObj)) {
			let role = roleTypeArr.find(byProp('ID', roleObj[roleIDStr]));
			let roleName = utils.replaceNewlines(role.Name)
			let rank = getRoleRank(role.Name);
			if (groupArr && groupIDStr) { //Committee/CPG
				let group = groupArr.find(byProp('ID', roleObj[groupIDStr]));
				msp[destArrStr].push(new objs.Role(roleName, rank, group.Name));
			} else { //Govt
				//Check for duplicates
				let dupe = msp[destArrStr].find((e)=> {
				return e.name === roleName;	
				});
				if (!dupe) {
					msp[destArrStr].push(new objs.Role(roleName, rank, 'SG'));
				}
			}
		}
	});
};

const processContactData = (
mspMap, arr, valTypeStr, typeArr, typeIDStr, destArr) => {
	arr.forEach((obj) => {
		let msp = mspMap.get(obj.PersonID);
		if (msp) {
			let typeStr = (typeArr.find(byProp('ID', obj[typeIDStr]))).Name;
			//Some specific code for dealing with addresses
			if (valTypeStr === 'Line1') {
				let street = obj.Line1 + ', ' + obj.Line2;
				let objToPush = new objs.Address(typeStr, street, obj.PostCode, obj.Region, obj.Town);
				msp[destArr].push(objToPush);
			}
			else if (obj[valTypeStr]) {
				let objToPush = new objs.Contact(typeStr, obj[valTypeStr]);
				msp[destArr].push(objToPush);
			}
		}
	});
};

const resetMSPArrays = (mspMap) => {
 mspMap.forEach((msp) => {
	for (let prop in msp) {
		if (Array.isArray(msp[prop])
		&& prop != 'govtRoles'
		&& prop != 'partyRoles') {
			msp[prop] = [];
		}
	}
 });
}

const getMSPsByDate = (date, data) => {
	let mspMap = new Map();
	let results = data.regResults.concat(data.constitResults);

	//Add election location and initial setting of map
	results.forEach((result) => {
		if (dateIsWithinRangeOfSPObj(date, result)) {
			let msp = new objs.MSP();
			if (result.ConstituencyID) {
				let constit = data.constituencies.find(byProp('ID', result.ConstituencyID));
				msp.constit = new objs.Area(constit.Name, constit.ConstituencyCode);
				let region = data.regions.find(byProp('ID', constit.RegionID));
				msp.region = new objs.Area(region.Name, region.RegionCode);
			} else {
				let region = data.regions.find(byProp('ID', result.RegionID));
				msp.region = new objs.Area(region.Name, region.RegionCode);
			}
			mspMap.set(result.PersonID, msp);
		}
	});

	//Add basic MSP data
	data.basicMSPData.forEach((mspDataObj) => {
			let msp = mspMap.get(mspDataObj.PersonID);
			if (msp) {
				let fullName = mspDataObj.ParliamentaryName.split(',');
				msp.firstName = fullName[1];
				msp.lastName = fullName[0];
				if (!mspDataObj.BirthDateIsProtected) {
					msp.DOB = utils.strToDate(mspDataObj.BirthDate);
				}
				msp.photoURL = mspDataObj.PhotoURL;
		}
	});

	//Add party membership
	data.partyMemberships.forEach((membershipObj) => {
		let msp = mspMap.get(membershipObj.PersonID);
		if (msp && dateIsWithinRangeOfSPObj(date, membershipObj)) {
			let partyObj = data.parties.find(byProp('ID', membershipObj.PartyID));

			//Fix for Dennis Canavan
			partyObj.Abbreviation = (partyObj.Abbreviation === '*') ? 'Ind' : partyObj.Abbreviation;

			msp.party = new objs.Party(partyObj.ActualName, partyObj.Abbreviation);

			//Note use of membership ID here, to find party role
			let partyRoles = data.partyMemberRoles.filter(byProp('MemberPartyID', membershipObj.ID, date));
			if (partyRoles) {
				partyRoles.forEach((role) => {
					let partyRoleType = data.partyRoles.find(byProp('ID', role.PartyRoleTypeID));
					let roleName = partyRoleType.Name;
					let roleNotes = utils.replaceNewlines(role.Notes)

					//HACK - Kezia. Should be able to remove this at some point when they update
					if ((membershipObj.PersonID === 3812) && 
					(date > new Date(2017, 7, 29)) &&
					(roleName === 'Party Leader')) {
						return 0;
					}

					let rank = getRoleRank(roleName);
					msp.partyRoles.push(new objs.Role(roleName, rank, roleNotes));
				});
			
			}
			//Fix for POs
			if (msp.party.abbreviation === 'NPA') {
				msp.partyRoles.push(new objs.Role('Presiding Officer', 0, 'Presiding Officer'));
			}
		}
	});
	
	//Add government roles
	processRoleData(
	date, mspMap, data.govtMemberRoles, data.govtRoles, 'GovernmentRoleID',
	'', '', 'govtRoles');
	
	return mspMap;
};

const updateMSPMapWithExpandedData = (date, data) => {

	resetMSPArrays(msp_map);

	processRoleData(
	date, msp_map, data.membercpgRoles, data.cpgRoles,
	'CrossPartyGroupRoleID', data.cpgs, 'CrossPartyGroupID', 'cpgRoles');
	
	processRoleData(
	date, msp_map, data.memberCommitteeRoles, data.committeeRoles,
	'CommitteeRoleID', data.committees, 'CommitteeID', 'committeeRoles');
		
	processContactData(msp_map, data.addresses, 'Line1', data.addressTypes,
	'AddressTypeID', 'addresses');
	
	processContactData(msp_map, data.emails, 'Address', data.emailTypes,
	'EmailAddressTypeID', 'emails');
	
	processContactData(msp_map, data.telephones, 'Telephone1', data.telephoneTypes,
	'TelephoneTypeID', 'telephones');
	
	processContactData(msp_map, data.websites, 'WebURL', data.websiteTypes,
	'WebSiteTypeID', 'websites');
	
};

export const getMSPMap = (date) => {
	return new Promise((resolve, reject) => {

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
};

export const getExpandedMSPMap = (date) => {
	return new Promise((resolve, reject) => {

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
};