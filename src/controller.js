'use strict';

const CURRENT_DATE = new Date();

//new Date(year, month[, date[, hours[, minutes[, seconds[, milliseconds]]]]]);

import * as model from './model.js';
import * as view from './view.js';

view.setupNavMenu();


//TODO: getMSPMap should return a promise so this can be tidier
model.getDataFromAPIs.then((data) => {

	let mspMap = model.getMSPMap(CURRENT_DATE, data);
	view.setView(mspMap);
	
});





