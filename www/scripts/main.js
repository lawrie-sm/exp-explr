/* TODO

General:
- Caching
- Default images
- Spinner
- Modules + Using Babel

MSPs:
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
		
	console.dir(constitResults);	
	console.dir(regResults);	
	console.dir(constits);
	console.dir(regions);
	
	
	//Grab the current MSPs from election results
	//Also stored regional/constituency IDS
	let mspList = getCurrentMSPsFromElectionResults(
	constitResults, regResults, constits, regions);
	
	addMSPData(mspList, basicMSPData);
	
	setupMSPComponentsInView(mspList);
	
});


			