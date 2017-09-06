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

//Builds a Map of MSPs using their PersonIDs
export const getMSPMap =
(constitResults, regResults, constituencies, regions) => {

	let r = new Map();
	let results;

	for (let isLoopingRegions = 0; isLoopingRegions < 2; isLoopingRegions++) {
		if (isLoopingRegions) {
			results = regResults;
		} else {
			results = constitResults;
		}

		results.forEach((electionResult) => {

			let startDate = null;
			let endDate = null;
			startDate = getSPDateFromStr(electionResult.ValidFromDate);
			if (electionResult.ValidUntilDate != null) {
				endDate = getSPDateFromStr(electionResult.ValidUntilDate);
			}

			if ((CURRENT_DATE >= startDate &&
					CURRENT_DATE <= endDate) ||
				(CURRENT_DATE >= startDate &&
					endDate == null)) {

				let newMSP = new MSP();

				if (isLoopingRegions) {

					let region = regions.find((reg) => {
						return reg.ID == electionResult.RegionID;
					});
					newMSP.region = new Area(region.Name, region.RegionCode);

				} else {

					let constit = constituencies.find((c) => {
						return c.ID == electionResult.ConstituencyID;
					});
					newMSP.constit = new Area(constit.Name, constit.ConstituencyCode);

					let region = regions.find((reg) => {
						return reg.ID == constit.RegionID;
					});
					newMSP.region = new Area(region.Name, region.RegionCode);

				}
				r.set(electionResult.PersonID, newMSP);
			}
		});
	}
	return r;
};

export const addMSPData = (mspMap, basicMSPData) => {
console.log(mspMap);

	mspMap.forEach((val, key, map) => {

		let mspDataObj = basicMSPData.find((dataElem) => {
			return dataElem.PersonID === key;
		});

		let fullName = mspDataObj.ParliamentaryName.split(',');
		val.firstName = fullName[1];
		val.lastName = fullName[0];

		if (!mspDataObj.BirthDateIsProtected) {
			val.DOB = getSPDateFromStr(mspDataObj.BirthDate);
		}

		val.photoURL = mspDataObj.PhotoURL;

	});
};