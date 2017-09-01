'use strict';

const currentDate = new Date();

const membersAPI = 'https://data.parliament.scot/api/members';
const constituencyElectionsAPI = 'https://data.parliament.scot/api/MemberElectionConstituencyStatuses';
const regionalElectionsAPI = 'https://data.parliament.scot/api/MemberElectionregionStatuses';
const regionsAPI = 'https://data.parliament.scot/api/regions';
const constituenciesAPI = 'https://data.parliament.scot/api/constituencies';

function Area (_name, _code) {
	this.name = _name;
	this.code = _code;
}

function MSP(
_ID, _constit, _region, _firstName, _lastName, _DOB, _photoURL) {
	this.ID = _ID;
	this.constit = _constit;
	this.region = _region;
	this.firstName = _firstName;
	this.lastName = _lastName;
	this.DOB = _DOB;
	this.photoURL = _photoURL;
}

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
}

/*
Determines the currently elected MSPs (by ID) from
election results API and assigns them the correct
region / constituency objects
*/
const getCurrentMSPsFromElectionResults =
(constitResults, regResults, constituencies, regions) => {
	
	let r = [];
	let results;
	
	for (let isLoopingRegions = 0; isLoopingRegions < 2; isLoopingRegions++)
	{
		if (isLoopingRegions) {
			results = regResults
		} else {
			results = constitResults
		}
		
		results.forEach((electionResult) => {

			let startDate = null;
			let endDate = null;
			startDate = getSPDateFromStr(electionResult.ValidFromDate);
			if (electionResult.ValidUntilDate != null) {
				endDate = getSPDateFromStr(electionResult.ValidUntilDate);
			}

			if ((currentDate >= startDate &&
					 currentDate <= endDate) ||
				  (currentDate >= startDate &&
					endDate == null)) {
				
					let newMSP = new MSP(electionResult.PersonID);
			
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
				r.push(newMSP);
			}
		});
	}
	return r;
}

/*
Copies over additional data from API into MSP objects
*/
const addMSPData = (mspList, basicMSPData) => {
	
	mspList.forEach((m) => {
	
		let mspDataObj = basicMSPData.find((dataElem) => {
			return dataElem.PersonID === m.ID;
		});
		
		let fullName = mspDataObj.ParliamentaryName.split(',');
		m.firstName = fullName[1];
		m.lastName = fullName[0];
		
		if (!mspDataObj.BirthDateIsProtected)
		{
			m.DOB = getSPDateFromStr(mspDataObj.BirthDate);
		}
		
		m.photoURL = mspDataObj.PhotoURL;
		
	});
}

//Processes an SP formatted date string into a JS date object
const getSPDateFromStr = (dateStr) => {
	
	let T = dateStr.indexOf('T');
	dateStr = dateStr.substring(0, T);
	dateStr = dateStr.replace(/\s+/g, '');
	let dateArr = dateStr.split('-');
	let year = dateArr[0], month = dateArr[1], day = dateArr[2];
	
	return new Date(year, (month - 1), day);
}