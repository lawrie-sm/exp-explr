'use strict';

import * as model from './model.js';
import * as view from './view.js';

view.setupNavMenu();

model.getDataFromAPIs.then((d) => {
	let mspMap = model.getMSPMap(
		d.constitResults, d.regResults, d.constits, d.regions);
	model.addMSPData(mspMap, d.basicMSPData);
	view.setView(mspMap);
});





