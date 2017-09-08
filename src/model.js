'use strict';

function Area(_name, _code) {		
	this.name = _name;
	this.code = _code;
}

function Party(_name, _abbreviation) {
	this.name = _name;
	this.abbreviation = _abbreviation;
}

function MSP
(_ID, _constit, _region, _firstName, _lastName, _DOB, _photoURL, _party, _partyRole, _govtRole) {
	this.constit = _constit;
	this.region = _region;
	this.firstName = _firstName;
	this.lastName = _lastName;
	this.DOB = _DOB;
	this.photoURL = _photoURL;
	this.party = _party;
	this.partyRole = _partyRole;
	this.govtRole = _govtRole;
}

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

const get = (url) => {
	return new Promise((resolve, reject) => {
		fetch(url, {
				method: 'get'
			})
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				if (!data) {
					//ERR
				}
				resolve(data);
			});
	});
};

export const getInitialMSPData = new Promise((resolve, reject) => {
	const API_ROOT = 'https://data.parliament.scot/api/';

	Promise.all([
	get(API_ROOT + 'members'),
	get(API_ROOT + 'MemberElectionConstituencyStatuses'),
	get(API_ROOT + 'MemberElectionregionStatuses'),
	get(API_ROOT + 'constituencies'),
	get(API_ROOT + 'regions'),
	get(API_ROOT + 'parties'),
	get(API_ROOT + 'memberparties'),
	get(API_ROOT + 'partyroles'),
	get(API_ROOT + 'memberpartyroles'),
	get(API_ROOT + 'governmentroles'),
	get(API_ROOT + 'membergovernmentroles')
	]).then((dataArr) => {

	let returnData = {
		'basicMSPData': dataArr[0],
		'constitResults':  dataArr[1],
		'regResults': dataArr[2],
		'constituencies': dataArr[3],
		'regions': dataArr[4],
		'parties': dataArr[5],
		'partyMemberships': dataArr[6],
		'partyRoles': dataArr[7],
		'partyMemberRoles': dataArr[8],
		'govtRoles': dataArr[9],
		'govtMemberRoles': dataArr[10]
	};

	resolve(returnData);
	
	});
});

const getMSPsByDate = (date, data) => {
	let mspMap = new Map();
	let results = data.regResults.concat(data.constitResults);
	
	results.forEach((result) => {
		if (dateIsWithinRangeOfSPObj(date, result)) {
			let msp = new MSP();
			let mspID = result.PersonID;

			//Get location - Could be regional or constituency MSP
			if (result.ConstituencyID) {
				let constit = data.constituencies.find((c) => {
					return c.ID == result.ConstituencyID;
				});
				msp.constit = new Area(constit.Name, constit.ConstituencyCode);
				let region = data.regions.find((reg) => {
					return reg.ID == constit.RegionID;
				});
				msp.region = new Area(region.Name, region.RegionCode);
				
			} else {
				let region = data.regions.find((reg) => {
					return reg.ID == result.RegionID;
				});
				msp.region = new Area(region.Name, region.RegionCode);
			}

			//Get basic data, name, DOB, photo
			let mspDataObj = data.basicMSPData.find((dataElem) => {
				return dataElem.PersonID === mspID;
			});
			let fullName = mspDataObj.ParliamentaryName.split(',');
			msp.firstName = fullName[1];
			msp.lastName = fullName[0];
			if (!mspDataObj.BirthDateIsProtected) {
				msp.DOB = strToDate(mspDataObj.BirthDate);
			}
			msp.photoURL = mspDataObj.PhotoURL;

			//Get party - we also need the "member party ID" to find its related party role
			let membership = data.partyMemberships.find((m) => {
				return (m.PersonID === mspID) &&
				dateIsWithinRangeOfSPObj(date, m);
			});
			let partyObj = data.parties.find((p) => {
				return (p.ID === membership.PartyID);
			});
			msp.party = new Party(partyObj.ActualName, partyObj.Abbreviation);
			let memberPartyID = membership.ID;
			let partyRoleObj = data.partyMemberRoles.find((m) => {
				// ! Note that we use memberPartyID here
				return (m.MemberPartyID === memberPartyID) && 
				dateIsWithinRangeOfSPObj(date, m);
			});
			if (partyRoleObj) {
				let partyRoleID = partyRoleObj.PartyRoleTypeID;
				let partyRole = data.partyRoles.find((r) => {
					return (r.ID === partyRoleID);
				});
				msp.partyRole = partyRole.Name;
			}
			
			//Get government role
			let govtRoleObj = data.govtMemberRoles.find((m) => {
				return (m.PersonID === mspID) &&
				dateIsWithinRangeOfSPObj(date, m);
			});
			if (govtRoleObj) {
				let govtRoleID = govtRoleObj.GovernmentRoleID;
				let govtRole = data.govtRoles.find((r) => {
					return (r.ID === govtRoleID);
				});
				msp.govtRole = govtRole.Name;
			}

			mspMap.set(mspID, msp);
		}
	});
	


	return mspMap;
};

export const getMSPMap = (date) => {
	return new Promise((resolve, reject) => {	
		getInitialMSPData.then((data) => {
			let mspMap = getMSPsByDate(date, data);
			resolve(mspMap);
		});
	});
};
