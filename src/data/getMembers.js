import moment from 'moment';

/*
  Called by the React app on startup and when the date is changed.
  Runs through the core data and processes it into an MSP list for
  a given date. Requires coreData from fetchCoreDataFromAPIs.

  This could probably be heavily optimised, but much of this should be
  done by SQL on the backend.
*/

// Linter disabled to suppress eqeqeq warnings (for ID strings/integers)
/* eslint-disable */

// Parses an SP formatted date (ISO 8601)
function parseSPDate(SPDate) {
  if (SPDate) return (moment(SPDate, moment.ISO_8601));
  return SPDate;
}

function isBetweenDates(selectedDate, fromSPDate, untilSPDate) {
  // Currently active statuses may have null expiry dates.
  if (!untilSPDate) untilSPDate = new moment();
  return (selectedDate.isBetween(fromSPDate, untilSPDate));
}

// Main function
function getMembers(selectedDate, coreData) {

  const memberData = [];

  // Determine MSPs for the current date by looking through
  // election statuses. Store the location info while we go.
  const cStatuses =
  coreData.MemberElectionConstituencyStatuses.filter((s) => {
    return isBetweenDates(selectedDate, s.ValidFromDate, s.ValidUntilDate);
  });
  const rStatuses =
  coreData.MemberElectionregionStatuses.filter((s) => {
    return isBetweenDates(selectedDate, s.ValidFromDate, s.ValidUntilDate);
  });
  // Constituencies
  for (let i = 0; i < cStatuses.length; i++) {
    const s = cStatuses[i];
    const constituency = coreData.constituencies.find((c) => c.ID == s.ConstituencyID);
    // eslint-disable-next-line
    const region = coreData.regions.find((r) => r.ID == constituency.RegionID);
    memberData.push({
      ID: s.PersonID,
      constituency: constituency.Name,
      region: region.Name,
    });
  }
  // Regions
  for (let i = 0; i < rStatuses.length; i++) {
    const s = rStatuses[i];
    const region = coreData.regions.find((r) => r.ID == s.RegionID);
    memberData.push({
      ID: s.PersonID,
      region: region.Name,
    });
  }

  console.log('Got Members...')
  
  // Should have the full 129 MSPs at this stage. Loop through using their personIDs
  for (let i = 0; i < memberData.length; i++) {

    console.log('...')

    const member = memberData[i];

    // Get basic info, such as names and DOBs
    const basicMemberData = coreData.members.find((m) => m.PersonID == member.ID);
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
    const addresses = coreData.addresses.filter((m) => m.PersonID == member.ID);
    if (addresses && addresses.length > 0) {
      member.addresses = [];
      addresses.sort((a, b) => a.AddressTypeID < b.AddressTypeID);
      for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i];
        const newAddress = {};
        newAddress.type = coreData.addresstypes.find((a) => a.ID == address.AddressTypeID).Name;
        if (address.Line1) newAddress.line1 = address.Line1;
        if (address.Line2) newAddress.line2 = address.Line2;
        if (address.PostCode) newAddress.postCode = address.PostCode;
        if (address.Region) newAddress.region = address.Region;
        if (address.Town) newAddress.town = address.Town;
        member.addresses.push(newAddress);
      }
    }

    // Get email addresses. Some addresses are hidden
    // (e.g will specify "Work Email" with blank address)
    // Don't added these, or create array if there are only hidden addresses
    const emailAddresses = coreData.emailaddresses.filter((m) => m.PersonID == member.ID);
    if (emailAddresses && emailAddresses.length > 0) {
      emailAddresses.sort((a, b) => a.EmailAddressTypeID < b.EmailAddressTypeID);
      for (let i = 0; i < emailAddresses.length; i++) {
        const emailAddress = emailAddresses[i];
        if (emailAddress.Address) {
          if (!member.emailAddresses) member.emailAddresses = [];
          const newEmailAddress = {};
          newEmailAddress.type =
          coreData.emailaddresstypes.find((e) => e.ID == emailAddress.EmailAddressTypeID).Name;
          newEmailAddress.address = emailAddress.Address;
          member.emailAddresses.push(newEmailAddress);
        }
      }
    }

    // Get websites
    const websites = coreData.websites.filter((m) => m.PersonID == member.ID);
    if (websites && websites.length > 0) {
      websites.sort((a, b) => a.WebSiteTypeID < b.WebSiteTypeID);
      for (let i = 0; i < websites.length; i++) {
        const website = websites[i];
        if (website.WebURL) {
          if (!member.websites) member.websites = [];
          const newWebsite = {};
          newWebsite.type =
          coreData.websitetypes.find((w) => w.ID == website.WebSiteTypeID).Name;
          newWebsite.url = website.WebURL;
          member.websites.push(newWebsite);
        }
      }
    }

    // Parties & Party Roles
    const partyMemberships = coreData.memberparties.filter((m) => {
      return isBetweenDates(selectedDate, m.ValidFromDate, m.ValidUntilDate);
    });
    const partyMembership = partyMemberships.find((m) => m.PersonID == member.ID);
    if (partyMembership) {
      const memberParty = coreData.parties.find((p) => p.ID == partyMembership.PartyID);
      member.party = {};
      member.party.name = memberParty.ActualName;
      member.party.abbreviation = memberParty.Abbreviation;
      member.party.ID = memberParty.ID;
      // Roles with multiple portfolios are listed separately with idential names in notes
      // We will dispense with the inconsistent notes and rely on the internal portfolio listings
      const roles = coreData.memberpartyroles.filter((r) => {
        return (r.MemberPartyID === partyMembership.ID &&
          isBetweenDates(selectedDate, r.ValidFromDate, r.ValidUntilDate));
      });
      // Party members can have any number of roles of various ranks
      // Only storing the highest rank in each case
      // 0 = Ldr, 1 = Deputy Ldr, 2 = Spox, 3 = Deputy Spox
      const role = {};
      role.title = '';
      role.rank = 10;
      if (roles && roles.length > 0) {
        role.portfolios = [];
        for (let i = 0; i < roles.length; i++) {
          const r = roles[i]
          const newRole = coreData.partyroles.find((pr) => pr.ID == r.PartyRoleTypeID);
          const isLeader = newRole.Name.search(/leader/gi) !== -1;
          const isDeputy = newRole.Name.search(/deputy/gi) !== -1;
          const captureRole = /(party spokesperson on the |party spokesperson on )(.*)/gi;
          const capRole = captureRole.exec(newRole.Name);
          if (capRole) role.portfolios.push(capRole[2]);
          if (isLeader && !isDeputy) role.rank = 0;
          else if (isLeader && isDeputy && role.rank > 1) role.rank = 1;
          else if (!isLeader && isDeputy && role.rank > 3) role.rank = 3;
          else if (role.rank > 2 && capRole) role.rank = 2;
        }
        // Build an appropriate title using the internal portfolios
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
      member.party.role = role;
    }

    // Government Role
    const govtRole = coreData.membergovernmentroles.find((r) => {
      return (r.PersonID == member.ID &&
        isBetweenDates(selectedDate, r.ValidFromDate, r.ValidUntilDate));
    });
    // Government roles are similarly ranked. Only one role per MSP.
    if (govtRole) {
      let title = '';
      let rank = 10;
      const role = coreData.governmentroles.find((rn) => rn.ID == govtRole.GovernmentRoleID);
      if (role) {
        const isPLO = role.Name.search(/(liaison officer|parliamentary aide)/gi) !== -1;
        const isMini = role.Name.search(/(minister)/gi) !== -1;
        const isCabSec = role.Name.search(/(cabinet secretary)/gi) !== -1;
        const isDeputy = role.Name.search(/(deputy)/gi) !== -1;
        const isFM = role.Name.search(/(first minister)/gi) !== -1;
        // Ignore PLOs
        if (!isPLO) {
          title = role.Name;
          if (isFM && !isDeputy) rank = 0;
          else if (isFM && isDeputy) rank = 1;
          else if (isCabSec) rank = 2;
          else if (isMini) rank = 3;
        }
        member.govtRole = { title, rank };
      }
    }

    // Committees
    const commRoles = coreData.personcommitteeroles.filter((r) => {
      return (r.PersonID == member.ID &&
        isBetweenDates(selectedDate, r.ValidFromDate, r.ValidUntilDate));
    });
    if (commRoles && commRoles.length > 0) {
      for (let i = 0; i < commRoles.length; i++) {
        const cr = commRoles[i];
        const role =
        coreData.committeeroles.find((r) => r.ID == cr.CommitteeRoleID);
        const committee = coreData.committees.find((comm) => {
          return (
            comm.ID == cr.CommitteeID &&
              isBetweenDates(selectedDate, cr.ValidFromDate, cr.ValidUntilDate) &&
              // Extra level of validation - check the committee itself is valid
              isBetweenDates(selectedDate, comm.ValidFromDate, comm.ValidUntilDate)
          );
        });
        if (role && committee) {
          if (!member.committees) member.committees = [];
          const newComm = {
            role: role.Name,
            name: committee.Name,
            abbreviation: committee.ShortName,
            ID: committee.ID,
          };
          // Rank the committee memberships
          let rank = 10;
          const isConv = role.Name.search(/(convener)/gi) !== -1;
          const isDeputy = role.Name.search(/(deputy)/gi) !== -1;
          const isSub = role.Name.search(/(substitute)/gi) !== -1;
          if (isConv && !isDeputy) rank = 0;
          else if (isConv && isDeputy) rank = 1;
          else if (!isSub) rank = 2;
          newComm.rank = rank;
          member.committees.push(newComm);
        }
      }
    }

    // CPGs
    const cpgRoles = coreData.membercrosspartyroles.filter((r) => {
      return (r.PersonID == member.ID &&
        isBetweenDates(selectedDate, r.ValidFromDate, r.ValidUntilDate));
    });
    if (cpgRoles && cpgRoles.length > 0) {
      // CPG roles appear to contain duplicates
      // Sort by date so we are adding the latest ones first and can check for dupes
      cpgRoles.sort((a, b) => parseSPDate(b.ValidFromDate) - parseSPDate(a.ValidFromDate));
      for (let i = 0; i < cpgRoles.length; i++) {
        const cpgRole = cpgRoles[i];
        const role =
        coreData.crosspartygrouproles.find((r) => r.ID == cpgRole.CrossPartyGroupRoleID);
        const cpg = coreData.crosspartygroups.find((grp) => {
          return (
            grp.ID == cpgRole.CrossPartyGroupID &&
            isBetweenDates(selectedDate, cpgRole.ValidFromDate, cpgRole.ValidUntilDate) &&
            // Extra level of validation - check the CPG itself is valid
            isBetweenDates(selectedDate, grp.ValidFromDate, grp.ValidUntilDate)
          );
        });
        if (role && cpg) {
          if (!member.cpgs) member.cpgs = [];
          // Check we haven't had this one before
          // Because the role list is sorted, we get the latest ones first
          const dupeCPGRole = member.cpgs.find((mcpg) => mcpg.ID === cpg.ID);
          if (!dupeCPGRole) {
            let cpgName = cpg.Name;
            const nameCap =/cross-party group in the scottish parliament on (\w.*)/gi;
            const capArr = nameCap.exec(cpg.Name);
            if (capArr && capArr[1]) cpgName = capArr[1];
            if (!cpgName) cpgName = cpg.Name;
            if (cpgName.substring(0,4) === 'the ') {
              console.log(cpgName)
              cpgName = cpgName.slice(4, cpgName.length);
            }
            const newCPG = {
              role: role.Name,
              name: cpgName,
              ID: cpg.ID,
            };
            let rank = 10;
            const isConv = role.Name.search(/(convener)/gi) !== -1;
            const isDeputy = role.Name.search(/(deputy)/gi) !== -1;
            const isVice = role.Name.search(/(vice)/gi) !== -1;
            const isTreasurer = role.Name.search(/(treasurer)/gi) !== -1;
            const isSecretary = role.Name.search(/(secretary)/gi) !== -1;
            if (isConv && !isDeputy && !isVice) rank = 0;
            else if (isConv && isDeputy) rank = 1;
            else if (isConv && isVice) rank = 2;
            else if (isTreasurer) rank = 3;
            else if (isSecretary) rank = 4;
            newCPG.rank = rank;
            member.cpgs.push(newCPG);
          }
        }
      }
    }
  }
  return (memberData);
}

export default getMembers;

/* eslint-enable */
