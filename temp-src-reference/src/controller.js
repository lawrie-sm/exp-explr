import * as model from './model';
import * as view from './view';

const CURRENT_DATE = new Date();

export const getExpandedCellData = date => new Promise((resolve, reject) => {
  const mspMap = model
    .getExpandedMSPMap(date).then((mspMap) => {
      resolve(mspMap);
    });
});

export const refreshView = (date, groupBy) => {
  model.getMSPMap(date).then((mspMap) => {
    view.refreshCells(mspMap, date, groupBy);
  });
};

//  Main
view.init(CURRENT_DATE);
refreshView(CURRENT_DATE, 'party');
