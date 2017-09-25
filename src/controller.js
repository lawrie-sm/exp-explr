'use strict';
import * as model from './model';
import * as view from './view';


const CURRENT_DATE = new Date();

export const getExpandedCellData = (date) => {
	return new Promise((resolve, reject) => {
		let mspMap = model.getExpandedMSPMap(date).then((mspMap) => {
			resolve(mspMap);
		});
	});
}

export const refreshView = (date, groupBy) => {
		model.getMSPMap(date).then((mspMap) => {
			view.refresh(mspMap, groupBy);
		});
}

/*** Main ***/


/*TODO: Merge init into view's refresh (conditional on first load) 
        + just call refreshView itself on first load*/

view.init(CURRENT_DATE);
model.getMSPMap(CURRENT_DATE).then((mspMap) => {
	view.refresh(mspMap); 
});