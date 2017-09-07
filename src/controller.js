'use strict';

const CURRENT_DATE = new Date();

//new Date(year, month[, date[, hours[, minutes[, seconds[, milliseconds]]]]]);

import * as model from './model.js';
import * as view from './view.js';

view.setupNavMenu();

model.getDataFromAPIs.then((d) => {
	
	//TODO: restructure so that the model is doing this + passes back
	//complete MSP map

	
	let mspMap = model.getMSPMap(
		CURRENT_DATE, d.constitResults, d.regResults, d.constits, d.regions);
		
	model.addMSPData(
	CURRENT_DATE, mspMap, d.basicMSPData, d.parties, d.partyMemberships);
	
	view.setView(mspMap);
	
});





