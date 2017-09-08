'use strict';
import * as model from './model';
import * as view from './view';

const CURRENT_DATE = new Date();

view.setupNavMenu();

model.getMSPMap(CURRENT_DATE).then((mspMap) => {
	view.setupMSPBlocks(mspMap);
});
