/*
  Called by the React app. Returns the MSP dict for a given date
  <PersonID> : { <MemberObject> }
*/

import fetchCoreDataFromAPIs from './fetchCoreDataFromAPIs';

// Parses an SP formatted date into a js date
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

// Determines whether a js Date is between two SP Dates
function isBetweenSPDates(selectedDate, fromSPDate, untilSPDate) {
  let fromDate = parseSPDate(fromSPDate);
  let untilDate = parseSPDate(untilSPDate);
  // Currently active statuses will have null expiry dates. Set to future.
  if (!untilDate) untilDate = new Date(9999, 0, 1);
  return (selectedDate < untilDate && selectedDate > fromDate);
}

// Finds an SP object by a given PersonID
function byID(pID) {
  return (m) => m.PersonID == pID;
}

// Builds a memberDict given core data from the API
// The dict uses PersonIDs as keys
function processData(coreData, selectedDate) {
  let memberDict = {};
  console.log(coreData);

  // Determine MSPs for the current date by looking through
  // election statuses. Store the location info while we go.
  const cStatuses = coreData.MemberElectionConstituencyStatuses;
  const rStatuses = coreData.MemberElectionregionStatuses;
  // Constituencies
  cStatuses.forEach((s) => {
    if (isBetweenSPDates(selectedDate, s.ValidFromDate, s.ValidUntilDate)) {
      // The constituency/region ID data is not zero indexed.
      const constituency = coreData.constituencies[s.ConstituencyID - 1];
      const region = coreData.regions[constituency.RegionID - 1];
      memberDict[s.PersonID] = {
        constituency: constituency.Name,
        region: region.Name,
      };
    }
  });
  // Regions
  rStatuses.forEach((s) => {
    if (isBetweenSPDates(selectedDate, s.ValidFromDate, s.ValidUntilDate)) {
      const region = coreData.regions[s.RegionID - 1];
      memberDict[s.PersonID] = {
        region: region.Name,
      };
    }
  });

  // Should have the full 129 MSPs at this stage. Loop through using their personIDs
  Object.keys(memberDict).forEach((pID) => {
    const member = memberDict[pID];

    // Get basic info, such as names and DOBs
    const basicMemberData = coreData.members.find(byID(pID));
    member.birthDate = parseSPDate(basicMemberData.BirthDate);
    member.photoURL = basicMemberData.PhotoURL;
    // Gender: 1 Female, 2 Male, 3 Undisclosed (No API for GenderTypes)
    if (basicMemberData.GenderTypeID === 1) {
      member.gender = 'Female';
    } else if (basicMemberData.GenderTypeID === 2) {
      member.gender = 'Male';
    } else member.gender = 'Undisclosed';
    // The name is reversed in SP data e.g "Bloggs, Joe"
    const name = basicMemberData.ParliamentaryName.split(',');
    member.name = `${name[1]} ${name[0]}`.trim();

    // Get physical addresses
    const addresses = coreData.addresses.filter(byID(pID));
    if (addresses && addresses.length > 0) {
      member.addresses = [];
      addresses.sort((a, b) => a.AddressTypeID < b.AddressTypeID);
      addresses.forEach((address) => {
        const newAddress = {};
        newAddress.type = coreData.addresstypes[address.AddressTypeID - 1].Name;
        if (address.Line1) newAddress.line1 = address.Line1;
        if (address.Line2) newAddress.line2 = address.Line2;
        if (address.PostCode) newAddress.postCode = address.PostCode;
        if (address.Region) newAddress.region = address.Region;
        if (address.Town) newAddress.town = address.Town;
        member.addresses.push(newAddress);
      });

      // Get email addresses. Some addresses are hidden
      // (e.g will specify "Work Email" with blank address)
      // Don't create array if there are only hidden addresses
      const emailAddresses = coreData.emailaddresses.filter(byID(pID));
      if (emailAddresses && emailAddresses.length > 0) {
        emailAddresses.sort((a, b) => a.EmailAddressTypeID < b.EmailAddressTypeID);
        emailAddresses.forEach((emailAddress) => {
          if (emailAddress.Address) {
            if (!member.emailAddresses) member.emailAddresses = [];
            const newEmailAddress = {};
            newEmailAddress.type =
            coreData.emailaddresstypes[emailAddress.EmailAddressTypeID - 1].Name;
            newEmailAddress.address = emailAddress.Address;
            member.emailAddresses.push(newEmailAddress);
          }
        });
      }
    }
  });

  console.log(memberDict);
  console.log(Object.keys(memberDict).length);

  return (coreData);
}

// Promise to fetch data from the API, processes it and return a memberDict
function getMemberDict(date) {
  return new Promise((resolve, reject) => {
    fetchCoreDataFromAPIs().then((coreData) => {
      let returnData = processData(coreData, date);
      resolve(returnData);
    });
  });
}

export default getMemberDict;

