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

// Builds a memberDict given core data from the API
// The dict uses PersonIDs as keys
function processData(coreData, selectedDate) {
  let memberData = {};
  console.log(coreData);

  // Determine MSPs for the current date by looking through
  // election statuses. Store the location info while we go.
  const cStatuses =
  coreData.MemberElectionConstituencyStatuses.filter((s) => {
    return isBetweenSPDates(selectedDate, s.ValidFromDate, s.ValidUntilDate);
  });
  const rStatuses =
  coreData.MemberElectionregionStatuses.filter((s) => {
    return isBetweenSPDates(selectedDate, s.ValidFromDate, s.ValidUntilDate);
  });
  // Constituencies
  cStatuses.forEach((s) => {
    const constituency = coreData.constituencies.find((c) => c.ID == s.ConstituencyID);
    const region = coreData.regions.find((r) => r.ID == constituency.RegionID);
    memberData[s.PersonID] = {
      constituency: constituency.Name,
      region: region.Name,
    };
  });
  // Regions
  rStatuses.forEach((s) => {
    const region = coreData.regions.find((r) => r.ID == s.RegionID);
    memberData[s.PersonID] = {
      region: region.Name,
    };
  });

  // Should have the full 129 MSPs at this stage. Loop through using their personIDs
  Object.keys(memberData).forEach((pID) => {
    const member = memberData[pID];

    // Get basic info, such as names and DOBs
    const basicMemberData = coreData.members.find((m) => m.PersonID == pID);
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
    const addresses = coreData.addresses.filter((m) => m.PersonID == pID);
    if (addresses && addresses.length > 0) {
      member.addresses = [];
      addresses.sort((a, b) => a.AddressTypeID < b.AddressTypeID);
      addresses.forEach((address) => {
        const newAddress = {};
        newAddress.type = coreData.addresstypes.find((a) => a.ID == address.AddressTypeID).Name;
        if (address.Line1) newAddress.line1 = address.Line1;
        if (address.Line2) newAddress.line2 = address.Line2;
        if (address.PostCode) newAddress.postCode = address.PostCode;
        if (address.Region) newAddress.region = address.Region;
        if (address.Town) newAddress.town = address.Town;
        member.addresses.push(newAddress);
      });
    }

    // Get email addresses. Some addresses are hidden
    // (e.g will specify "Work Email" with blank address)
    // Don't added these, or create array if there are only hidden addresses
    const emailAddresses = coreData.emailaddresses.filter((m) => m.PersonID == pID);
    if (emailAddresses && emailAddresses.length > 0) {
      emailAddresses.sort((a, b) => a.EmailAddressTypeID < b.EmailAddressTypeID);
      emailAddresses.forEach((emailAddress) => {
        if (emailAddress.Address) {
          if (!member.emailAddresses) member.emailAddresses = [];
          const newEmailAddress = {};
          newEmailAddress.type =
          coreData.emailaddresstypes.find((e) => e.ID == emailAddress.EmailAddressTypeID).Name;
          newEmailAddress.address = emailAddress.Address;
          member.emailAddresses.push(newEmailAddress);
        }
      });
    }

    // Get websites
    const websites = coreData.websites.filter((m) => m.PersonID == pID);
    if (websites && websites.length > 0) {
      websites.sort((a, b) => a.WebSiteTypeID < b.WebSiteTypeID);
      websites.forEach((website) => {
        if (website.WebURL) {
          if (!member.websites) member.websites = [];
          const newWebsite = {};
          newWebsite.type =
          coreData.websitetypes.find((w) => w.ID == website.WebSiteTypeID).Name;
          newWebsite.url = website.WebURL;
          member.websites.push(newWebsite);
        }
      });
    }

    // Parties & Party Roles
    const partyMemberships = coreData.memberparties.filter((m) => {
      return isBetweenSPDates(selectedDate, m.ValidFromDate, m.ValidUntilDate);
    });
    const partyMembership = partyMemberships.find((m) => m.PersonID == pID);
    if (partyMembership) {      
      let memberParty = coreData.parties.find((p) => p.ID == partyMembership.PartyID);
      member.party = {};
      member.party.Name = memberParty.ActualName;
      member.party.Abbreviation = memberParty.Abbreviation;
      // Roles with multiple portfolios are listed separately with idential names in notes
      // We will dispense with the inconsistent notes and rely on the internal portfolio listings
      let roles = coreData.memberpartyroles.filter((r) => {
        return (r.MemberPartyID === partyMembership.ID &&
          isBetweenSPDates(selectedDate, r.ValidFromDate, r.ValidUntilDate));
      });
      if (roles && roles.length > 0) {
        member.party.roles = [];
        roles.forEach((r) => {
          const newRole = coreData.partyroles.find((pr) => pr.ID == r.PartyRoleTypeID);
          member.party.roles.push(newRole.Name);
        });
      }
    }

    // Government Roles
    const govtRoles = coreData.membergovernmentroles.filter((r) => {
      return (r.PersonID == pID &&
        isBetweenSPDates(selectedDate, r.ValidFromDate, r.ValidUntilDate));
    });
    if (govtRoles && govtRoles.length > 0) {
      govtRoles.forEach((gr) => {
        let role = coreData.governmentroles.find((rn) => rn.ID == gr.GovernmentRoleID);
        if (role) {
          if (!member.govtRoles) member.govtRoles = [];
          member.govtRoles.push(role.Name);
        }
      });
    }

    // Committees
    const commRoles = coreData.personcommitteeroles.filter((r) => {
      return (r.PersonID == pID &&
        isBetweenSPDates(selectedDate, r.ValidFromDate, r.ValidUntilDate));
    });
    if (commRoles && commRoles.length > 0) {
      commRoles.forEach((cr) => {
        let role =
        coreData.committeeroles.find((r) => r.ID == cr.CommitteeRoleID).Name;
        let committee = coreData.committees.find((comm) => {
          return (comm.ID == cr.CommitteeID &&
            isBetweenSPDates(selectedDate, cr.ValidFromDate, cr.ValidUntilDate));
        });

        if (role && committee) {
          if (!member.committees) member.committees = [];
          member.committees.push({ role, name: committee.Name, ID: committee.ID });
        }
      });
    }

    // CPGs
    const cpgRoles = coreData.membercrosspartyroles.filter((r) => {
      return (r.PersonID == pID &&
        isBetweenSPDates(selectedDate, r.ValidFromDate, r.ValidUntilDate));
    });
    if (cpgRoles && cpgRoles.length > 0) {
      cpgRoles.forEach((cpgr) => {
        let role =
        coreData.crosspartygrouproles.find((r) => r.ID == cpgr.CrossPartyGroupRoleID).Name;
        let cpg = coreData.crosspartygroups.find((grp) => {
          return (grp.ID == cpgr.CrossPartyGroupID &&
            isBetweenSPDates(selectedDate, cpgr.ValidFromDate, cpgr.ValidUntilDate));
        });
        if (role && cpg) {
          if (!member.cpgs) member.cpgs = [];
          member.cpgs.push({ role, name: cpg.Name, ID: cpg.ID });
        }
      });
    }
  });
  
  console.log(memberData);
  console.log('No. MSP objects: ' + Object.keys(memberData).length);
  return (coreData);
}

// Promise to fetch core data from the API, process it, and return a memberDict
function getMembers(date) {
  return new Promise((resolve, reject) => {
    fetchCoreDataFromAPIs().then((coreData) => {
      let returnData = processData(coreData, date);
      resolve(returnData);
    });
  });
}

export default getMembers;
