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


			