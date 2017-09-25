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

export const refreshView = (date) => {
		model.getMSPMap(date).then((mspMap) => {
			view.refreshCells(mspMap, date);
		});
}

/*** Main ***/
view.init(CURRENT_DATE);
refreshView(CURRENT_DATE);