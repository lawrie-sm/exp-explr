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
    if (!party) {
      partyList.push({
        name: member.party.name,
        abbreviation: member.party.abbreviation,
        ID: member.party.ID,
        memberInfos: [member],
        // TODO: Icon info and additional member object (roles)
      });
    } else {
      party.memberInfos.push(member);
    }
  });
  partyList.sort((a, b) => a.memberInfos.length < b.memberInfos.length);
  // TODO: Sorting within list by role seniority.
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
            memberInfos: [{ member, role: mc.role }],
          });
        } else {
          committee.memberInfos.push({ member, role: mc.role });
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