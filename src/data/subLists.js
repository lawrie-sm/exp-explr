/*
  Called by the React app on startup and when the list type is changed.
  Returns sorted and cut-down sublists of members using the members list
*/


// The default party list, contains all member grouped by largest party
// Members within the list are sorted by rank
function getPartyList(members) {
  let partyList = [];
  members.forEach((member) => {
    let party = partyList.find((p) => p.ID === member.party.ID);
    if (!party) {
      partyList.push({
        name: member.party.name,
        abbreviation: member.party.abbreviation,
        ID: member.party.ID,
        members: [member],
        // Icon info and additional member info field here
      });
    } else {
      party.members.push(member);
    }
  });
  partyList.sort((a, b) => a.members.length < b.members.length);
  return partyList;
}


/*
getCommList(members) {
  
}
getCPGList(members) {
  
}
getFrontBenchList(members) {
  
}
*/

export default getPartyList;
