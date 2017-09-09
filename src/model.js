'use strict';

import * as objs from './objs';
import * as http from './http';

//TODO: Won't need these once we have proper caching
let basic_data_cache = null;
let expanded_data_cache = null;
let msp_map = null;

const strToDate = (dateStr) => {
	let T = dateStr.indexOf('T');
	dateStr = dateStr.substring(0, T);
	dateStr = dateStr.replace(/\s+/g, '');
	let dateArr = dateStr.split('-');
	let year = dateArr[0],
	month = dateArr[1],
	day = dateArr[2];
	return new Date(year, (month - 1), day);
};

const dateIsWithinRangeOfSPObj = (date, spObj) => {
	let startDate = strToDate(spObj.ValidFromDate);
	let endDate = (spObj.ValidUntilDate != null) ?
	strToDate(spObj.ValidUntilDate) : null;
	return ((date >= startDate && date <= endDate) ||
	(date >= startDate && endDate == null));
};

	let byProp = (typeToCheck, valueToFind, date) => {
		if (date) {
			return (e) => {
				return (e[typeToCheck] === valueToFind &&
				dateIsWithinRangeOfSPObj(date, e));
				};
		} else {
			return (e) => {
				return e[typeToCheck] === valueToFind;
			};
		}
	};

const getMSPsByDate = (date, data) => {
	let mspMap = new Map();
	let results = data.regResults.concat(data.constitResults);
	
	results.forEach((result) => {
		if (dateIsWithinRangeOfSPObj(date, result)) {
			let msp = new objs.MSP();
			let mspID = result.PersonID;

			//Get location - Could be regional or constituency MSP
			if (result.ConstituencyID) {
				let constit = data.constituencies.find(byProp('ID', result.ConstituencyID));
				msp.constit = new objs.Area(constit.Name, constit.ConstituencyCode);
				let region = data.regions.find(byProp('ID', constit.RegionID));
				msp.region = new objs.Area(region.Name, region.RegionCode);
				
			} else {
				let region = data.regions.find(byProp('ID', result.RegionID));
				msp.region = new objs.Area(region.Name, region.RegionCode);
			}

			//Get basic data, name, DOB, photo
			let mspDataObj = data.basicMSPData.find(byProp('PersonID', mspID));
			let fullName = mspDataObj.ParliamentaryName.split(',');
			msp.firstName = fullName[1];
			msp.lastName = fullName[0];
			if (!mspDataObj.BirthDateIsProtected) {
				msp.DOB = strToDate(mspDataObj.BirthDate);
			}
			msp.photoURL = mspDataObj.PhotoURL;

			//Get party - we also need the "member party ID" to find its related party role
			let membership = data.partyMemberships.find(byProp('PersonID', mspID, date));
			let partyObj = data.parties.find(byProp('ID', membership.PartyID));
			msp.party = new objs.Party(partyObj.ActualName, partyObj.Abbreviation);

			//Note use of membership.ID here, to find party role
			let partyRoles = data.partyMemberRoles.filter(byProp('MemberPartyID', membership.ID, date));
			if (partyRoles) {
				partyRoles.forEach((role) => {
					let partyRole = data.partyRoles.find(byProp('ID', role.PartyRoleTypeID));
					msp.partyRoles.push(partyRole.Name);
				});
			}
			
			//Get government role
			let govtRoles = data.govtMemberRoles.filter(byProp('PersonID', mspID, date));
			if (govtRoles) {
				govtRoles.forEach((role) => {
				let govtRole = data.govtRoles.find(byProp('ID', role.GovernmentRoleID));
				msp.govtRoles.push(govtRole.Name);
				});
			}

			mspMap.set(mspID, msp);
		}
	});
	return mspMap;
};


const updateMSPMapWithExpandedData = (date, data) => {
	console.dir(data);
	msp_map.forEach((msp) => {

		/*TODO: Rewrite the other MSP data adding code to be less search-intensive
		, then replicate here*/

	});
};


export const getMSPMap = (date) => {
		return new Promise((resolve, reject) => {	
			
			if (!basic_data_cache) {
				http.getInitialMSPData().then((data) => {
					basic_data_cache = data;
					msp_map = getMSPsByDate(date, basic_data_cache);
					resolve(msp_map);
				});
			}
			else {
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
			updateMSPMapWithExpandedData(expanded_data_cache);
			resolve(msp_map);
		}

	});
};