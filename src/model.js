'use strict';

const CURRENT_DATE = new Date();

function Area(_name, _code) {		
	this.name = _name;
	this.code = _code;
}

function MSP
(_ID, _constit, _region, _firstName, _lastName, _DOB, _photoURL) {
	this.constit = _constit;
	this.region = _region;
	this.firstName = _firstName;
	this.lastName = _lastName;
	this.DOB = _DOB;
	this.photoURL = _photoURL;
}

const getSPDateFromStr = (dateStr) => {
	let T = dateStr.indexOf('T');
	dateStr = dateStr.substring(0, T);
	dateStr = dateStr.replace(/\s+/g, '');
	let dateArr = dateStr.split('-');
	let year = dateArr[0],
	month = dateArr[1],
	day = dateArr[2];
	return new Date(year, (month - 1), day);
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

	const get = (url) => {
		return new Promise((resolve, reject) => {
			fetch(url, {
					method: 'get'
				})
				.then(function (response) {
					return response.json();
				})
				.then(function (data) {
					resolve(data);
				});
		});
	};
		
	Promise.all([
	get(membersAPI),
	get(constituencyElectionsAPI),
	get(regionalElectionsAPI),
	get(constituenciesAPI),
	get(regionsAPI)
	]).then((dataArr) => {

	let returnData = {
	'basicMSPData': dataArr[0],
	'constitResults':  dataArr[1],
	'regResults': dataArr[2],
	'constits': dataArr[3],
	'regions': dataArr[4],
	}

	resolve(returnData);
	
	});
});

// Builds a Map of MSPs using their PersonIDs
// TODO: Make it work with other time ranges than current

export const getMSPMap =
(constitResults, regResults, constituencies, regions) => {

	let mspMap = new Map();
	let results = regResults.concat(constitResults);
	results.forEach((result) => {
			
		let startDate = getSPDateFromStr(result.ValidFromDate);
		let endDate = (result.ValidUntilDate != null) ?
		getSPDateFromStr(result.ValidUntilDate) : null;

		if ((CURRENT_DATE >= startDate && CURRENT_DATE <= endDate) ||
			(CURRENT_DATE >= startDate && endDate == null)) {

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

	return mspMap;
};

export const addMSPData = (mspMap, basicMSPData) => {
console.log(mspMap);

	mspMap.forEach((msp, mspID) => {

		let mspDataObj = basicMSPData.find((dataElem) => {
			return dataElem.PersonID === mspID;
		});
		let fullName = mspDataObj.ParliamentaryName.split(',');
		msp.firstName = fullName[1];
		msp.lastName = fullName[0];
		if (!mspDataObj.BirthDateIsProtected) {
			msp.DOB = getSPDateFromStr(mspDataObj.BirthDate);
		}
		msp.photoURL = mspDataObj.PhotoURL;

	});
};