(function () {
	'use strict';

	const currentDate = new Date();

	const APIroot = 'https://data.parliament.scot/api/';
	const membersAPI = APIroot + 'members';
	const constituencyElectionsAPI = APIroot + 'MemberElectionConstituencyStatuses';
	const regionalElectionsAPI = APIroot + 'MemberElectionregionStatuses';
	const regionsAPI = APIroot + 'regions';
	const constituenciesAPI = APIroot + 'constituencies';

	class Area {
		constructor(_name, _code) {
			this.name = _name;
			this.code = _code;
		}
	}

	class MSP {
		constructor(
			_ID, _constit, _region, _firstName, _lastName, _DOB, _photoURL) {
			this.ID = _ID;
			this.constit = _constit;
			this.region = _region;
			this.firstName = _firstName;
			this.lastName = _lastName;
			this.DOB = _DOB;
			this.photoURL = _photoURL;
		}
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
	};

	/*
	Determines the currently elected MSPs (by ID) from
	election results API and assigns them the correct
	region / constituency objects
	*/
	const getCurrentMSPsFromElectionResults =
		(constitResults, regResults, constituencies, regions) => {

			let r = [];
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
		};

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

			if (!mspDataObj.BirthDateIsProtected) {
				m.DOB = getSPDateFromStr(mspDataObj.BirthDate);
			}

			m.photoURL = mspDataObj.PhotoURL;

		});
	};

	//Processes an SP formatted date string into a JS date object
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

	const colsClass = 'cols';
	const cellClass = 'cols--cell';
	const txtBoxClass = 'txtbox';
	const portraitBoxClass = 'portrait-box';
	const portraitImgClass = 'portrait-img';
	const smallImgPath = '/img/portraits/';
	const main = document.getElementsByTagName('main')[0];

	//Code for building the HTML elements
	const E = (tag, attrs = {}, text = '', ...children) => {

		const e = document.createElement(tag);

		if (attrs) {
			for (let key in attrs) {
				e.setAttribute(key, attrs[key]);
			}
		}

		if (text) {
			e.appendChild(document.createTextNode(text));
		}

		for (let i = 0; i < children.length; i++) {
			e.appendChild(children[i]);
		}

		return e;

	};

	const setupMSPComponentsInView = (mspList) => {

		mspList.forEach((m) => {

			let location;
			if (m.constit) {
				location = m.constit.name + ', ' + m.region.name;
			} else {
				location = m.region.name;
			}


			let birthDate = '(Birth date not given)';
			if (m.DOB) {
				let d = m.DOB;
				birthDate = d.getDate() +
					'/' + (d.getMonth() + 1) +
					'/' + d.getFullYear();
			}

			let imgSRC = m.photoURL;
			let imgAlt = m.firstName + ' portrait';

			if (imgSRC) {

				let imgID = imgSRC.substring(imgSRC.lastIndexOf('/') + 1);
				imgID = imgID.replace(/\s+/g, '');
				imgSRC = smallImgPath + imgID + '.jpg';

			} else {
				imgSRC = '#';
			}

			let MSPComponent = E('div', {
					'class': colsClass
				}, '',
				E('div', {
						'class': cellClass
					}, '',
					E('div', {
							'class': portraitBoxClass
						}, '',
						E('img', {
							'class': portraitImgClass,
							'src': imgSRC,
							'alt': imgAlt
						})),
					E('div', {
							'class': txtBoxClass
						}, '',
						E('p', {}, m.firstName + ' ' + m.lastName),
						E('p', {}, birthDate),
						E('p', {}, location)
					)));


			main.appendChild(MSPComponent);

		});

	};

	/******************************************************************/

	Promise.all([
		get(membersAPI),
		get(constituencyElectionsAPI),
		get(regionalElectionsAPI),
		get(constituenciesAPI),
		get(regionsAPI)
	]).then((dataArr) => {

		let basicMSPData = dataArr[0];
		let constitResults = dataArr[1];
		let regResults = dataArr[2];
		let constits = dataArr[3];
		let regions = dataArr[4];

		//Grab the current MSPs from election results
		//Also stored regional/constituency IDS
		let mspList = getCurrentMSPsFromElectionResults(
			constitResults, regResults, constits, regions);

		addMSPData(mspList, basicMSPData);

		setupMSPComponentsInView(mspList);

	});

}());