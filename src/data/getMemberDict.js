/*
  Called by the React app. Returns the MSP dict for a given date
  <PersonID> : { <MemberObject> }
*/

import fetchMemberDataFromAPIs from './fetchMemberDataFromAPIs';

function processData(memberData, date) {
  let pData = {};

  // Determine MSPs for the current date by looking
  // through election results.

  //'MemberElectionConstituencyStatuses',
  //'MemberElectionregionStatuses',

  return (memberData);
}

function getMemberDict(date) {
  return new Promise((resolve, reject) => {
    fetchMemberDataFromAPIs().then((memberData) => {
      let returnData = processData(memberData, date);
      resolve(returnData);
    });
  });
}

export default getMemberDict;
