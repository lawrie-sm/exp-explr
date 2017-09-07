'use strict';

function Area(_name, _code) {		
	this.name = _name;
	this.code = _code;
}

function Party(_name, _abbreviation) {
	this.name = _name;
	this.abbreviation = _abbreviation
}

function MSP
(_ID, _constit, _region, _firstName, _lastName, _DOB, _photoURL, _party) {
	this.constit = _constit;
	this.region = _region;
	this.firstName = _firstName;
	this.lastName = _lastName;
	this.DOB = _DOB;
	this.photoURL = _photoURL;
	this.party = _party;
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

/******************************************************************/

//EXPORTS

export const getDataFromAPIs = new Promise((resolve, reject) => {
	const APIroot = 'https://data.parliament.scot/api/';
	const membersAPI = APIroot + 'members';
	const constituencyElectionsAPI = APIroot + 'MemberElectionConstituencyStatuses';
	const regionalElectionsAPI = APIroot + 'MemberElectionregionStatuses';
	const regionsAPI = APIroot + 'regions';
	const constituenciesAPI = APIroot + 'constituencies';
	const partyAPI = APIroot + 'parties';
	const partyMembershipAPI = APIroot + 'memberparties';


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
						console.log('Error getting data!');
					}
					resolve(data);
				});
		});
	};
		
	Promise.all([
	get(membersAPI),
	get(constituencyElectionsAPI),
	get(regionalElectionsAPI),
	get(constituenciesAPI),
	get(regionsAPI),
	get(partyAPI),
	get(partyMembershipAPI)
	]).then((dataArr) => {

	let returnData = {
	'basicMSPData': dataArr[0],
	'constitResults':  dataArr[1],
	'regResults': dataArr[2],
	'constits': dataArr[3],
	'regions': dataArr[4],
  'parties': dataArr[5],
	'partyMemberships': dataArr[6]
	}

	resolve(returnData);
	
	});
});

// Builds a Map of MSPs using their PersonIDs
export const getMSPMap =
(date, constitResults, regResults, constituencies, regions) => {

//TODO: Api call here + return a promise from this funct

	let mspMap = new Map();
	let results = regResults.concat(constitResults);
	results.forEach((result) => {
			
		if (dateIsWithinRangeOfSPObj(date, result)) {

			let msp = new MSP();
			
			if (result.ConstituencyID) {
				let constit = constituencies.find((c) => {
					return c.ID == result.ConstituencyID;
				});
				msp.constit = new Area(constit.Name, constit.ConstituencyCode);
				let region = regions.find((reg) => {
					return reg.ID == constit.RegionID;
				});
				msp.region = new Area(region.Name, region.RegionCode);
				
			} else {
				let region = regions.find((reg) => {
					return reg.ID == result.RegionID;
				});
				msp.region = new Area(region.Name, region.RegionCode);
			}
			
			mspMap.set(result.PersonID, msp);
		}
	});

	//TODO: addMSPdata call here
	
	return mspMap;
};

export const addMSPData = (date, mspMap, basicMSPData, parties, partyMemberships) => {
	
	mspMap.forEach((msp, mspID) => {

		let mspDataObj = basicMSPData.find((dataElem) => {
			return dataElem.PersonID === mspID;
		});
		let fullName = mspDataObj.ParliamentaryName.split(',');
		msp.firstName = fullName[1];
		msp.lastName = fullName[0];
		if (!mspDataObj.BirthDateIsProtected) {
			msp.DOB = strToDate(mspDataObj.BirthDate);
		}
		msp.photoURL = mspDataObj.PhotoURL;
		
	
		let membership = partyMemberships.find((memb) => {
			return (memb.PersonID === mspID) &&
			dateIsWithinRangeOfSPObj(date, memb);
		});
		let partyObj = parties.find((p) => {
			return (p.ID === membership.PartyID);
		});
		msp.party = new Party(partyObj.ActualName, partyObj.Abbreviation);
		

	});
};

