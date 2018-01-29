/*
  Called by the React app on startup and when the list type is changed.
  Returns sorted and cut-down sublists of members using the members list
  Each sublist contains name, abbreviation, ID and individual members list.
*/


// The default party list, contains all member grouped by largest party
// Members within the list are sorted by rank
export function getPartyList(memberData) {
  const partyList = [];
  memberData.forEach((member) => {
    const party = partyList.find((p) => p.ID === member.party.ID);
    let roleTitle = '';
    let rank = 10;
    if (member.govtRole) {
      roleTitle = member.govtRole.title;
      rank = member.govtRole.rank;
    } else if (member.party.role) {
      roleTitle = member.party.role.title;
      rank = member.party.role.rank;
    }
    if (!party) {
      const newParty = {
        name: member.party.name,
        abbreviation: member.party.abbreviation,
        ID: member.party.ID,
        memberInfos: [{ member, roleTitle, rank }],
      };
      partyList.push(newParty);
    } else {
      party.memberInfos.push({ member, roleTitle, rank });
    }
  });
  partyList.sort((a, b) => a.memberInfos.length < b.memberInfos.length);
  partyList.forEach((pl) => pl.memberInfos.sort((a, b) => a.rank - b.rank));
  return partyList;
}

export function getCommList(memberData) {
  const commList = [];
  memberData.forEach((member) => {
    if (member.committees && member.committees.length > 0) {
      member.committees.forEach((mc) => {
        const committee = commList.find((c) => c.ID === mc.ID);
        const rank = mc.rank;
        if (!committee) {
          commList.push({
            name: mc.name,
            abbreviation: mc.abbreviation,
            ID: mc.ID,
            memberInfos: [{ member, roleTitle: mc.role, rank: mc.rank }],
          });
        } else {
          committee.memberInfos.push({ member, roleTitle: mc.role, rank: mc.rank });
        }
      });
    }
  });
  commList.sort((a, b) => a.memberInfos.length < b.memberInfos.length);
  commList.forEach((cl) => cl.memberInfos.sort((a, b) => a.rank - b.rank));
  return commList;
}

/*
getCPGList(members) {
  
}
getFrontBenchList(members) {
  
}
*/