/*
  Called by the React app. Returns the MSP dict for a given date
  <PersonID> : { <MemberObject> }
*/

import fetchMemberDataFromAPIs from './fetchMemberDataFromAPIs';

// Parses the SP date format into js
// YYYY-MM-DDThh:mm:ss. Months are not zero indexed
function parseSPDate(SPDate) {
  if (SPDate) {
    const dateRegex = /(\d*)-(\d*)-(\d*)/g;
    const matches = dateRegex.exec(SPDate);
    const year = parseInt(matches[1], 10);
    const month = parseInt(matches[2], 10) - 1;
    const day = parseInt(matches[3], 10);
    return new Date(year, month, day);
  } return SPDate;
}

function isBetweenSPDates(selectedDate, fromSPDate, untilSPDate) {
  let fromDate = parseSPDate(fromSPDate);
  let untilDate = parseSPDate(untilSPDate);
  // Currently active statuses will have null expiry dates. Set to future.
  if (!untilDate) untilDate = new Date(9999, 1, 1);
  return (selectedDate < untilDate && selectedDate > fromDate);
}

function processData(memberData, selectedDate) {
  let pData = {};
  console.log(memberData);

  // Determine MSPs for the current date by looking
  // through election statuses.

  const cStatuses = memberData.MemberElectionConstituencyStatuses;
  const rStatuses = memberData.MemberElectionregionStatuses;

  cStatuses.forEach((s) => {
    if (isBetweenSPDates(selectedDate, s.ValidFromDate, s.ValidUntilDate)) {
      pData[s.PersonID] = { ConstituencyID: s.ConstituencyID };
    }
  });

  console.log(pData);
  console.log(Object.keys(pData).length);

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

