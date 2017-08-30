const colsClass = 'cols';
const cellClass = 'cols--cell';
const txtBoxClass = 'txtbox';
const main = document.getElementsByTagName('main')[0];

const constituencyURL = 'https://data.parliament.scot/api/MemberElectionConstituencyStatuses';
const regionURL = 'https://data.parliament.scot/api/MemberElectionregionStatuses';
const membersURL = 'https://data.parliament.scot/api/members';
let mspList = [];
let currentDate = new Date();


/*********************************************/

Promise.all([get(constituencyURL), get(regionURL), get(membersURL)])
.then((dataArr) => {
	
	let electionResults = dataArr[0].concat(dataArr[1]);
	mspList = getMSPDataFromElectionResults(electionResults);
	
	//console.log(mspList);
	//console.log(dataArr[2]);
	
});



/*********************************************/

function get(url) {
	return new Promise((resolve, reject) => {
		fetch(url, {
			method: 'get'
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			resolve(data);
		});
	});
}

function getMSPDataFromElectionResults(sourceArr)
{
	let r = [];
	sourceArr.forEach(function(elem) {
		
		
		let dateStr = elem.ValidFromDate;
		let T = dateStr.indexOf('T');
		dateStr = dateStr.substring(0, T);
		let dateArr = dateStr.split('-');
		let year = dateArr[0], month = dateArr[1], day = dateArr[2];
		
		
	});
	return r;
}


/*
function addMemberEntry (member, i, arr) {
	
	var cols = document.createElement('div');
	var cell = document.createElement('div');
	var txtBox = document.createElement('div');
	var p = document.createElement('p');
	
	var pText = document.createTextNode(member.ParliamentaryName);
	
	cols.className = colsClass;
	cell.className = cellClass;
	txtBox.className = txtBoxClass;
	
	cols.appendChild(cell);
	cell.appendChild(txtBox);
	txtBox.appendChild(p);
	p.appendChild(pText);
	
	main.appendChild(cell);
	
}
*/