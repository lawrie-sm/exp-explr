const colsClass = 'cols';
const cellClass = 'cols--cell cols--cell__fullwidth';
const txtBoxClass = 'txtbox';
const portraitClass = 'portrait-box';
const imgBoxClass = 'imgbox';

const smallImgPath = '/img/portraits/';

const main = document.getElementsByTagName('main')[0];

const constituencyURL = 'https://data.parliament.scot/api/MemberElectionConstituencyStatuses';
const regionURL = 'https://data.parliament.scot/api/MemberElectionregionStatuses';
const membersURL = 'https://data.parliament.scot/api/members';

let currentDate = new Date();

/********************************************************************/

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

//Returns array of current MSPs IDs based on SPs election results arrays 
//and whether the election dates fall within current date
const getMSPIDsFromElectionResults = (sourceArr) => {
	let r = [];
	sourceArr.forEach(function (elem) {

		let startDate = null;
		let endDate = null;

		startDate = getSPDateFromStr(elem.ValidFromDate);

		if (elem.ValidUntilDate != null) {
			endDate = getSPDateFromStr(elem.ValidUntilDate);
		}

		if ((currentDate >= startDate &&
				currentDate <= endDate) ||
			(currentDate >= startDate &&
				endDate == null)) {
			r.push(elem.PersonID);
		}

	});
	return r;
}

//Returns an array of full MSP objects, given an array of their IDs
//and the full array of MSP objects
const getMSPObjectsFromIDs = (mspIDList, mspObjects) => {
	let r = [];
	mspObjects.forEach(function (elem) {
		if (mspIDList.includes(elem.PersonID)) {
			r.push(elem);
		}
	});
	return r;
}

//Processes an SP formatted date into a JS date object
const getSPDateFromStr = (dateStr) => {
	let T = dateStr.indexOf('T');
	dateStr = dateStr.substring(0, T);
	dateStr = dateStr.replace(/\s+/g, '');
	let dateArr = dateStr.split('-');
	let year = dateArr[0], month = dateArr[1], day = dateArr[2];
	return new Date(year, (month - 1), day);
}

//Code for building the HTML elements
const E = (tag, attrs = {}, text = '', ... children) => {

	const e = document.createElement(tag);
	
	if (attrs) {
		for (let key in attrs) {
			e.setAttribute(key, attrs[key]);
		}
	}

	if (text) {
		e.appendChild(document.createTextNode(text));
	}

	for (let i = 0; i < children.length; i++)
		{
			e.appendChild(children[i]);
		}

	return e;

};

const addMSPComponent = (member) => {
	
	let name = member.ParliamentaryName;
		
	let birthDate = '(Birth date not given)';
	if (!member.BirthDateIsProtected)
	{
		let d = getSPDateFromStr(member.BirthDate);
		birthDate = d.getDate() +
		'/' + (d.getMonth()+1) +
		'/' + d.getFullYear();
	}
	
	let imgSRC = member.PhotoURL;
	let imgAlt = name + ' portait';
	
	if (imgSRC) {
	
		let imgID = imgSRC.substring(imgSRC.lastIndexOf('/') + 1);
		imgID = imgID.replace(/\s+/g, '');
		imgSRC = smallImgPath + imgID + '.jpg';
		
	} else {
		
		imgSRC = '#';
	}
	
	let MSPComponent = E('div', { 'class': colsClass }, '',
	E('div', { 'class': cellClass }, '',
		E('div', { 'class': imgBoxClass }, '',
			E('img', { 'class': portraitClass, 'src': imgSRC })),
		E('div', { 'class': txtBoxClass }, '',
			E('p', {}, member.ParliamentaryName),
			E('p', {}, birthDate)),
		));

		
		main.appendChild(MSPComponent);
		
	}

		/********************************************************************/
		
		/* TODO
		
		- Default image 
		
	  More info:
		- Constituency / Region (link to ONS region code?)
				See:
				http://statistics.data.gov.uk/def/geography/collection/S16
				http://statistics.data.gov.uk/def/geography/collection/S17
		- Party
		- Email addresses
		- Addresses
		- Telephones
		- Websites
		- Government, Committee, CPG, Parliamentary roles
		- Election results (inc. previous)
		- Register of interests
		
		*/
		
		Promise.all([get(constituencyURL), get(regionURL), get(membersURL)])
		.then((dataArr) => {

			let electionResults = dataArr[0].concat(dataArr[1]);
			let mspIDList = getMSPIDsFromElectionResults(electionResults);
			let mspList = getMSPObjectsFromIDs(mspIDList, dataArr[2]);

			mspList.forEach(function (elem) {
				addMSPComponent(elem);

			});
		});
			