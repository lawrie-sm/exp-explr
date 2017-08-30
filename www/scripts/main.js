const colsClass = 'cols';
const cellClass = 'cols--cell';
const txtBoxClass = 'txtbox';
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
	let dateArr = dateStr.split('-');
	let year = dateArr[0],
		month = dateArr[1],
		day = dateArr[2];
	return new Date(year, (month - 1), day);
}

//TODO:
//https://stackoverflow.com/questions/40075726/whats-a-good-way-to-dynamically-render-dom-elements-with-plain-old-js


//Code for building the HTML elements
const E = (tag, attrs = {}, text, children) => {

	const e = document.createElement(tag);
	Object.assign(e, attrs);

	if (text) {
		e.appendChild(document.createTextNode(text));
	}

	if (children) {
		if (typeof children === 'Array') {
			for (let i = 0; i < children.length; i++) {
				e.appendChild(children[i]);
			}

		} else
			e.appendChild(children);
	}

	return e;

};

const addMemberEntry = (member) => {


	//TODO: Make this work with arrays and attributes

		let colCell = E('div', {}, '', E('div'));


		main.appendChild(colCell);

		}



		/********************************************************************/

		Promise.all([get(constituencyURL), get(regionURL), get(membersURL)])
			.then((dataArr) => {

				let electionResults = dataArr[0].concat(dataArr[1]);
				let mspIDList = getMSPIDsFromElectionResults(electionResults);
				let mspList = getMSPObjectsFromIDs(mspIDList, dataArr[2]);

				mspList.forEach(function (elem) {
					addMemberEntry(elem);
				});


			});