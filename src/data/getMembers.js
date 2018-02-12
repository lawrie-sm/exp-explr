/*
  Called by the React app on startup and when the date is changed.
  Runs through the core data and processes it into an MSP list for
  a given date. Requires coreData from fetchCoreDataFromAPIs.
*/

import moment from 'moment';

const IMG_URL_ROOT_SMALL = './img/members/small/';

// Parses an SP formatted date (ISO 8601)
function parseSPDate(SPDate) {
  if (SPDate) return (moment(SPDate, moment.ISO_8601));
  return SPDate;
}

function isBetweenDates(selectedDate, fromSPDate, untilSPDate) {
  // Currently active statuses may have null expiry dates.
  let until = untilSPDate;
  if (!until) until = moment();
  return (selectedDate.isBetween(fromSPDate, until));
}

// Main function
function getMembers(selectedDate, coreData) {
  const memberData = {};

  // Determine MSPs for the current date by looking through
  // election statuses. Store the location info while we go.
  const cStatuses =
  coreData.MemberElectionConstituencyStatuses.filter((s) => (
    isBetweenDates(
      selectedDate,
      parseSPDate(s.ValidFromDate),
      parseSPDate(s.ValidUntilDate),
    )
  ));
  const rStatuses =
  coreData.MemberElectionregionStatuses.filter((s) => (
    isBetweenDates(
      selectedDate,
      parseSPDate(s.ValidFromDate),
      parseSPDate(s.ValidUntilDate),
    )
  ));
  // Constituencies
  for (let i = 0; i < cStatuses.length; i++) {
    const s = cStatuses[i];
    const constituency =
    coreData.constituencies.find((c) => c.ID === parseInt(s.ConstituencyID, 10));
    // eslint-disable-next-line
    const region = coreData.regions.find((r) => r.ID == constituency.RegionID);
    memberData[s.PersonID] = {
      ID: parseInt(s.PersonID, 10),
      constituency: constituency.Name,
      region: region.Name,
    };
  }
  // Regions
  for (let i = 0; i < rStatuses.length; i++) {
    const s = rStatuses[i];
    const region = coreData.regions.find((r) => r.ID === parseInt(s.RegionID, 10));
    memberData[s.PersonID] = {
      ID: parseInt(s.PersonID, 10),
      region: region.Name,
    };
  }

  // Get basic info, such as names and DOBs
  for (let i = 0; i < coreData.members.length; i++) {
    const info = coreData.members[i];
    const member = memberData[info.PersonID];
    if (member) {
      member.birthDate = parseSPDate(info.BirthDate);
      member.photoURL = info.PhotoURL;
      if (info.GenderTypeID === 1) {
        member.gender = 'Female';
      } else if (info.GenderTypeID === 2) {
        member.gender = 'Male';
      } else member.gender = 'Undisclosed';
      const name = info.ParliamentaryName.split(',');
      member.name = `${name[1]} ${name[0]}`.trim();
      // Add image URLs based on name
      const imgName = `${member.name.replace(/\s+/g, '')}.jpg`;
      member.imgURLs = {};
      member.imgURLs.small = `${IMG_URL_ROOT_SMALL}${imgName}`;
    }
  }

  // Get physical addresses
  for (let i = 0; i < coreData.addresses.length; i++) {
    const address = coreData.addresses[i];
    const member = memberData[address.PersonID];
    if (member) {
      if (!member.addresses) member.addresses = [];
      const newAddress = {};
      if (address.Line1) newAddress.line1 = address.Line1;
      if (address.Line2) newAddress.line2 = address.Line2;
      if (address.PostCode) newAddress.postCode = address.PostCode;
      if (address.Region) newAddress.region = address.Region;
      if (address.Town) newAddress.town = address.Town;
      member.addresses.push(newAddress);
    }
  }

  // Get email addresses. Some addresses are hidden and are not added
  for (let i = 0; i < coreData.emailaddresses.length; i++) {
    const eAddress = coreData.emailaddresses[i];
    const member = memberData[eAddress.PersonID];
    if (member && eAddress.Address) {
      if (!member.emailAddresses) member.emailAddresses = [];
      const newEmailAddress = {};
      newEmailAddress.type =
      coreData.emailaddresstypes.find((e) =>
        e.ID === parseInt(eAddress.EmailAddressTypeID, 10)).Name;
      newEmailAddress.address = eAddress.Address;
      member.emailAddresses.push(newEmailAddress);
    }
  }

  // Get websites
  for (let i = 0; i < coreData.websites.length; i++) {
    const website = coreData.websites[i];
    const member = memberData[website.PersonID];
    if (member && website.WebURL) {
      if (!member.websites) member.websites = [];
      const newWebsite = {};
      newWebsite.type =
      coreData.websitetypes.find((w) => w.ID === parseInt(website.WebSiteTypeID, 10)).Name;
      newWebsite.url = website.WebURL;
      member.websites.push(newWebsite);
    }
  }

  // Party info - roles are dealt with separately
  for (let i = 0; i < coreData.memberparties.length; i++) {
    const mInfo = coreData.memberparties[i];
    const member = memberData[mInfo.PersonID];
    if (member &&
      isBetweenDates(
        selectedDate,
        parseSPDate(mInfo.ValidFromDate),
        parseSPDate(mInfo.ValidUntilDate),
      )) {
      const partyInfo = coreData.parties.find((p) => p.ID === parseInt(mInfo.PartyID, 10));
      member.party = {};
      member.party.name = partyInfo.ActualName;
      member.party.abbreviation = partyInfo.Abbreviation;
      member.party.ID = partyInfo.ID;
      // Have to store the membership ID to find corresponding roles
      member.party.membershipID = mInfo.ID;
    }
  }

  // Party role portfolios and ranks, titles will be built later
  for (let i = 0; i < coreData.memberpartyroles.length; i++) {
    const pRole = coreData.memberpartyroles[i];
    const member =
    Object.values(memberData).find((m) =>
      m.party.membershipID === parseInt(pRole.MemberPartyID, 10));
    const validFromDate = parseSPDate(pRole.ValidFromDate);
    if (member &&
      isBetweenDates(
        selectedDate,
        validFromDate,
        parseSPDate(pRole.ValidUntilDate),
      )) {
      if (!member.party.role) {
        member.party.role = {};
        member.party.role.portfolios = [];
        member.party.role.rank = 10;
        member.party.role.validFromDate = validFromDate;
      }
      const roleInfo = coreData.partyroles.find((r) =>
        r.ID === parseInt(pRole.PartyRoleTypeID, 10));
      const isLeader = roleInfo.Name.search(/leader/gi) !== -1;
      const isDeputy = roleInfo.Name.search(/deputy/gi) !== -1;
      const captureRole = /(party spokesperson on the |party spokesperson on )(.*)/gi;
      const capRole = captureRole.exec(roleInfo.Name);
      if (capRole && !member.party.role.portfolios.includes(capRole[2])) {
        member.party.role.portfolios.push(capRole[2]);
      }
      if (isLeader && !isDeputy && member.party.role.rank > 0) member.party.role.rank = 0;
      else if (isLeader && isDeputy && member.party.role.rank > 1) member.party.role.rank = 1;
      else if (!isLeader && isDeputy && member.party.role.rank > 3) member.party.role.rank = 3;
      else if (member.party.role.rank > 2 && capRole) member.party.role.rank = 2;
    }
  }

  // Government roles
  for (let i = 0; i < coreData.membergovernmentroles.length; i++) {
    const gRole = coreData.membergovernmentroles[i];
    const member = memberData[gRole.PersonID];
    const validFromDate = parseSPDate(gRole.ValidFromDate);
    if (member &&
      isBetweenDates(
        selectedDate,
        validFromDate,
        parseSPDate(gRole.ValidUntilDate),
      )) {
      const roleInfo = coreData.governmentroles.find((rn) =>
        rn.ID === parseInt(gRole.GovernmentRoleID, 10));
      const govtRole = {};
      govtRole.title = '';
      govtRole.rank = 10;
      govtRole.validFromDate = validFromDate;
      const isPLO = roleInfo.Name.search(/(liaison officer|parliamentary aide)/gi) !== -1;
      const isMini = roleInfo.Name.search(/(minister)/gi) !== -1;
      const isCabSec = roleInfo.Name.search(/(cabinet secretary)/gi) !== -1;
      const isDeputy = roleInfo.Name.search(/(deputy)/gi) !== -1;
      const isFM = roleInfo.Name.search(/(first minister)/gi) !== -1;
      if (!isPLO) {
        govtRole.title = roleInfo.Name;
        if (isFM && !isDeputy) govtRole.rank = 0;
        else if (isFM && isDeputy) govtRole.rank = 1;
        else if (isCabSec) govtRole.rank = 2;
        else if (isMini) govtRole.rank = 3;
      }
      member.govtRole = govtRole;
    }
  }

  // Committees
  for (let i = 0; i < coreData.personcommitteeroles.length; i++) {
    const cRole = coreData.personcommitteeroles[i];
    const member = memberData[cRole.PersonID];
    const validFromDate = parseSPDate(cRole.ValidFromDate);
    if (member &&
      isBetweenDates(
        selectedDate,
        validFromDate,
        parseSPDate(cRole.ValidUntilDate),
      )) {
      const roleInfo = coreData.committeeroles.find((r) =>
        r.ID === parseInt(cRole.CommitteeRoleID, 10));
      const committee = coreData.committees.find((comm) => (
        comm.ID === parseInt(cRole.CommitteeID, 10) &&
        isBetweenDates(
          selectedDate,
          parseSPDate(comm.ValidFromDate),
          parseSPDate(comm.ValidUntilDate),
        )
      ));
      if (committee) {
        if (!member.committees) member.committees = [];
        let name = committee.Name.trim();
        if (name.slice(name.length - 10, name.length) === ' Committee') {
          name = name.slice(0, name.length - 10);
        }
        const newComm = {
          role: roleInfo.Name,
          name,
          abbreviation: committee.ShortName,
          validFromDate,
          ID: committee.ID,
        };
        let rank = 10;
        const isConv = roleInfo.Name.search(/(convener)/gi) !== -1;
        const isDeputy = roleInfo.Name.search(/(deputy)/gi) !== -1;
        const isSub = roleInfo.Name.search(/(substitute)/gi) !== -1;
        if (isConv && !isDeputy) rank = 0;
        else if (isConv && isDeputy) rank = 1;
        else if (!isSub) rank = 2;
        newComm.rank = rank;
        member.committees.push(newComm);
      }
    }
  }

  // CPGs. These values contain duplicates so need to check dates.
  for (let i = 0; i < coreData.membercrosspartyroles.length; i++) {
    const cpgRole = coreData.membercrosspartyroles[i];
    const member = memberData[cpgRole.PersonID];
    const validFromDate = parseSPDate(cpgRole.ValidFromDate);
    if (member &&
      isBetweenDates(
        selectedDate,
        validFromDate,
        parseSPDate(cpgRole.ValidUntilDate),
      )) {
      const cpg = coreData.crosspartygroups.find((grp) => (
        grp.ID === parseInt(cpgRole.CrossPartyGroupID, 10) &&
        isBetweenDates(
          selectedDate,
          parseSPDate(grp.ValidFromDate),
          parseSPDate(grp.ValidUntilDate),
        )
      ));
      if (cpg) {
        if (!member.cpgs) member.cpgs = [];

        // Add new CPG role if a later one doesn't exist
        const dupeCPGIndex = member.cpgs.findIndex((currCPG) =>
          currCPG.ID === parseInt(cpg.ID, 10));
        let isReplacing = false;
        if (dupeCPGIndex !== -1) {
          isReplacing =
          !!(member.cpgs[dupeCPGIndex].validFromDate.isBefore(parseSPDate(cpg.ValidFromDate)));
        }
        if (dupeCPGIndex === -1 || isReplacing) {
          const role =
          coreData.crosspartygrouproles.find((r) =>
            r.ID === parseInt(cpgRole.CrossPartyGroupRoleID, 10));
          let cpgName = cpg.Name;
          const nameCap = /cross-party group in the scottish parliament on (\w.*)/gi;
          const capArr = nameCap.exec(cpg.Name);
          if (capArr && capArr[1]) cpgName = capArr[1];
          if (!cpgName) cpgName = cpg.Name;
          if (cpgName.substring(0, 4) === 'the ') cpgName = cpgName.slice(4, cpgName.length);
          const newCPG = {
            role: role.Name,
            name: cpgName,
            validFromDate,
            ID: cpg.ID,
          };
          let rank = 10;
          const isConv = role.Name.search(/(convener)/gi) !== -1;
          const isCoCo = role.Name.search(/(co-convener)/gi) !== -1;
          const isDeputy = role.Name.search(/(deputy)/gi) !== -1;
          const isVice = role.Name.search(/(vice)/gi) !== -1;
          const isTreasurer = role.Name.search(/(treasurer)/gi) !== -1;
          const isSecretary = role.Name.search(/(secretary)/gi) !== -1;
          if (isConv && !isDeputy && !isVice && !isCoCo) rank = 0;
          else if (isCoCo) rank = 1;
          else if (isConv && isDeputy) rank = 2;
          else if (isConv && isVice) rank = 3;
          else if (isTreasurer) rank = 4;
          else if (isSecretary) rank = 5;
          newCPG.rank = rank;
          if (!isReplacing) member.cpgs.push(newCPG);
          else member.cpgs.splice(dupeCPGIndex, 1, newCPG);
        }
      }
    }
  }

  // Make the dict an array, sort info arrays, and add party titles.
  const memberList = Object.values(memberData);
  for (let i = 0; i < memberList.length; i++) {
    const member = memberList[i];
    if (member.addresses) {
      member.addresses.sort((a, b) => a.AddressTypeID - b.AddressTypeID);
    }
    if (member.emailAddresses) {
      member.emailAddresses.sort((a, b) => a.EmailAddress - b.EmailAddressTypeID);
    }
    if (member.websites) {
      member.websites.sort((a, b) => a.WebSiteTypeID - b.WebSiteTypeID);
    }
    if (member.committees) {
      member.committees.sort((a, b) => a.rank - b.rank);
    }
    if (member.cpgs) {
      member.cpgs.sort((a, b) => a.rank - b.rank);
    }
    if (member.party.role) {
      const role = member.party.role;
      if (role.rank === 0 && role.portfolios.length < 1) {
        role.title = 'Party Leader';
      } else if (role.rank === 0 && role.portfolios.length > 0) {
        role.title = `Party Leader. Spokesperson on ${role.portfolios.join(', ')}`;
      } else if (role.rank === 1 && role.portfolios.length < 1) {
        role.title = 'Deputy Leader';
      } else if (role.rank === 1 && role.portfolios.length > 0) {
        role.title = `Deputy Leader. Spokesperson on ${role.portfolios.join(', ')}`;
      } else if (role.rank === 2) {
        role.title = `Spokesperson on ${role.portfolios.join(', ')}`;
      } else if (role.rank === 3) {
        role.title = `Deputy Spokesperson on ${role.portfolios.join(', ')}`;
      }
    }
  }


  return (memberList);
}

export default getMembers;
