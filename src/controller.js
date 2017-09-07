'use strict';

const CURRENT_DATE = new Date();

import * as model from './model.js';
import * as view from './view.js';

view.setupNavMenu();

model.getDataFromAPIs.then((d) => {
	
	let mspMap = model.getMSPMap(
		CURRENT_DATE, d.constitResults, d.regResults, d.constits, d.regions);
		
	model.addMSPData(
	CURRENT_DATE, mspMap, d.basicMSPData, d.parties, d.partyMemberships);
	
	view.setView(mspMap);
	
});





