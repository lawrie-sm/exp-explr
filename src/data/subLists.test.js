/* eslint-env jest */

import { getPartyList, getGroupList } from '../data/subLists';

it('returns the party list', () => {
  const memberData = [
    {
      ID: 1735,
      govtRole: {
        title: 'Cabinet Secretary for Communities, Social Security and Equalities',
        rank: 2,
      },
      name: 'Angela Constance',
      party: {
        name: 'Scottish National Party',
        abbreviation: 'SNP',
        ID: 7,
        membershipID: 598,
      },
    },
  ];
  const expected = [
    {
      ID: 7,
      abbreviation: 'SNP',
      name: 'Scottish National Party',
      memberInfos: [
        {
          rank: 2,
          roleTitle: 'Cabinet Secretary for Communities, Social Security and Equalities',
          member: {
            ID: 1735,
            govtRole: {
              title: 'Cabinet Secretary for Communities, Social Security and Equalities',
              rank: 2,
            },
            name: 'Angela Constance',
            party: {
              name: 'Scottish National Party',
              abbreviation: 'SNP',
              ID: 7,
              membershipID: 598,
            },
          },
        },
      ],
    },
  ];
  expect(getPartyList(memberData)).toMatchObject(expected);
});

it('returns a group list', () => {
  const memberData = [
    {
      ID: 5929,
      committees: [
        {
          ID: 263,
          abbreviation: 'EJFW',
          name: 'Economy, Jobs and Fair Work',
          rank: 10,
          role: 'Substitute Member',
        },
      ],
      name: 'Tom Mason',
      party: {
        name: 'Scottish Conservative and Unionist Party',
        abbreviation: 'Con',
        ID: 3,
        membershipID: 703,
      },
    },
  ];
  const expected = [
    {
      ID: 263,
      name: 'Economy, Jobs and Fair Work',
      memberInfos: [
        {
          rank: 10,
          roleTitle: 'Substitute Member',
          member: {
            ID: 5929,
            committees: [
              {
                ID: 263,
                abbreviation: 'EJFW',
                name: 'Economy, Jobs and Fair Work',
                rank: 10,
                role: 'Substitute Member',
              },
            ],
            name: 'Tom Mason',
            party: {
              name: 'Scottish Conservative and Unionist Party',
              abbreviation: 'Con',
              ID: 3,
              membershipID: 703,
            },
          },
        },
      ],
    },
  ];
  expect(getGroupList(memberData, 'committee')).toMatchObject(expected);
});
