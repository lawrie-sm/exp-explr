/*
  Called by the React app on startup and when the list type is changed.
  Returns sorted and cut-down sublists of members using the members list
  Each sublist contains name, abbreviation, ID and individual members list.
*/


// The default party list, contains all member grouped by largest party
// Members within the list are sorted by rank
export function getPartyList(memberData) {
  let partyList = [];
  memberData.forEach((member) => {
    let party = partyList.find((p) => p.ID === member.party.ID);
    let roleTitle = '';
    if (member.party.role) roleTitle = member.party.role.title;
    if (member.govtRole) roleTitle = member.govtRole.title;
    if (!party) {
      const newParty = {
        name: member.party.name,
        abbreviation: member.party.abbreviation,
        ID: member.party.ID,
        memberInfos: [{ member, roleTitle }],
      };
      if (member.govtRole) newParty.isPartyOfGovt = true;
      else newParty.isPartyOfGovt = false;
      partyList.push(newParty);
    } else {
      party.memberInfos.push({ member, roleTitle });
      if (member.govtRole) party.isPartyOfGovt = true;
    }
  });
  partyList.sort((a, b) => a.memberInfos.length < b.memberInfos.length);
  partyList.forEach((pl) => {
    if (!pl.isPartyOfGovt) {
      pl.memberInfos.sort((a, b) => a.member.party.role.rank - b.member.party.role.rank);
    } else {
      pl.memberInfos.sort((a, b) => {
        let aRank = (a.member.govtRole) ? a.member.govtRole.rank : 10;
        let bRank = (b.member.govtRole) ? b.member.govtRole.rank : 10;
        
        return (aRank - bRank);
      });
    }
  });
  return partyList;
}

export function getCommList(memberData) {
  let commList = [];
  memberData.forEach((member) => {
    if (member.committees && member.committees.length > 0) {
      member.committees.forEach((mc) => {
        let committee = commList.find((c) => c.ID === mc.ID);
        if (!committee) {
          commList.push({
            name: mc.name,
            abbreviation: mc.abbreviation,
            ID: mc.ID,
            memberInfos: [{ member, roleTitle: mc.role }],
          });
        } else {
          committee.memberInfos.push({ member, roleTitle: mc.role });
        }
      });
    }
  });
  commList.sort((a, b) => a.memberInfos.length < b.memberInfos.length);

  return commList;
}

/*
getCPGList(members) {
  
}
getFrontBenchList(members) {
  
}
*/