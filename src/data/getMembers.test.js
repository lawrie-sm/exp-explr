/* eslint-env jest */

import moment from 'moment';
import {
  parseSPDate,
  filterByDate,
  getConstituencyMembers,
  getRegionalMembers,
  isBetweenDates,
  getBasicInfo,
  getPartyInfoAndRoles,
  getGovtRoles,
  getCommitteeRoles,
  getcpgRoles,
  createMemberListAndAddTitles,
  getMembers,
} from './getMembers';


it('Date parsing works', () => {
  const parsedDate = parseSPDate('2017-05-11T00:00:00');
  const referenceDate = moment({ year: 2017, month: 4, date: 11 });
  expect(parsedDate.isSame(referenceDate)).toBeTruthy();
  expect(parseSPDate('2017')).toBeNull();
  expect(parseSPDate(2017)).toBeNull();
  expect(parseSPDate('hello')).toBeNull();
  expect(parseSPDate(undefined)).toBeNull();
});

it('Finding dates between ranges works', () => {
  const min = moment({ year: 2010, month: 0, date: 1 });
  const max = moment({ year: 2018, month: 0, date: 1 });
  const inRange = moment({ year: 2014, month: 0, date: 1 });
  const outOfRange = moment({ year: 2000, month: 0, date: 1 });
  expect(isBetweenDates(inRange, min, max)).toBeTruthy();
  expect(isBetweenDates(inRange, min, null)).toBeTruthy();
  expect(isBetweenDates(outOfRange, min, max)).toBeFalsy();
  expect(isBetweenDates(outOfRange, min, null)).toBeFalsy();
});

it('Date filtering works', () => {
  const arrToFilter = [
    {
      ValidFromDate: '2005-01-01T00:00:00',
      ValidUntilDate: '2010-01-02T23:59:59',
    },
    {
      ValidFromDate: '2010-01-01T00:00:00',
      ValidUntilDate: '2018-01-02T23:59:59',
    },
    {
      ValidFromDate: '2015-01-01T00:00:00',
      ValidUntilDate: null,
    },
  ];
  const noDates = moment({ year: 2000, month: 0, date: 1 });
  const oneDate = moment({ year: 2012, month: 0, date: 1 });
  const twoDates = moment({ year: 2017, month: 0, date: 1 });
  expect(filterByDate(noDates, arrToFilter)).toHaveLength(0);
  expect(filterByDate(oneDate, arrToFilter)).toHaveLength(1);
  expect(filterByDate(twoDates, arrToFilter)).toHaveLength(2);
});

it('Getting members by constituency works', () => {
  const statuses = [
    { ID: 306, PersonID: 1001, ConstituencyID: 1 },
    { ID: 307, PersonID: 1002, ConstituencyID: 103 },
    { ID: 307, PersonID: 1003, ConstituencyID: 146 },
  ];
  const constituencies = [
    { ID: 1, Name: 'Airdrie and Shotts', RegionID: 1 },
    { ID: 103, Name: 'Edinburgh Northern and Leith', RegionID: 12 },
    { ID: 146, Name: 'Strathkelvin and Bearsden', RegionID: 16 },
  ];
  const regions = [
    { ID: 1, Name: 'Central Scotland' },
    { ID: 12, Name: 'Lothian' },
    { ID: 16, Name: 'West Scotland' },
  ];
  const coreData = { constituencies, regions };
  const expected = [
    { ID: 1001, constituency: 'Airdrie and Shotts', region: 'Central Scotland' },
    { ID: 1002, constituency: 'Edinburgh Northern and Leith', region: 'Lothian' },
    { ID: 1003, constituency: 'Strathkelvin and Bearsden', region: 'West Scotland' },
  ];
  expect(getConstituencyMembers(statuses, coreData)).toEqual(expect.arrayContaining(expected));
});

it('Getting members by region works', () => {
  const statuses = [
    { ID: 306, PersonID: 1001, RegionID: 1 },
    { ID: 307, PersonID: 1002, RegionID: 12 },
    { ID: 307, PersonID: 1003, RegionID: 16 },
  ];
  const regions = [
    { ID: 1, Name: 'Central Scotland' },
    { ID: 12, Name: 'Lothian' },
    { ID: 16, Name: 'West Scotland' },
  ];
  const coreData = { regions };
  const expected = [
    { ID: 1001, region: 'Central Scotland' },
    { ID: 1002, region: 'Lothian' },
    { ID: 1003, region: 'West Scotland' },
  ];
  expect(getRegionalMembers(statuses, coreData)).toEqual(expect.arrayContaining(expected));
});

it('Adding basic info works', () => {
  const memberData = {
    1001: { ID: 1001 },
    1002: { ID: 1002 },
  };
  const coreData = {
    members: [
      {
        PersonID: 1001,
        BirthDate: '1970-01-01T00:00:00',
        ParliamentaryName: 'Smith, John',
        GenderTypeID: 2,
      },
      {
        PersonID: 1002,
        BirthDate: '',
        ParliamentaryName: 'Doe, Jane',
        GenderTypeID: 1,
        PhotoURL: 'http://www.example.com',
      },
    ],
  };
  const expected = {
    1001: {
      ID: 1001,
      birthDate: moment({ year: 1970, month: 0, date: 1 }),
      name: 'John Smith',
      gender: 'Male',
      imgURLs: { small: './img/members/small/JohnSmith.jpg' },
    },
    1002: {
      ID: 1002,
      name: 'Jane Doe',
      gender: 'Female',
      imgURLs: { small: './img/members/small/JaneDoe.jpg' },
      photoURL: 'http://www.example.com',
    },
  };
  getBasicInfo(memberData, coreData);
  const IDs = Object.keys(memberData);
  for (let i = 0; i < IDs.length; i++) {
    const id = IDs[i];
    // Need to use moment's 'isSame' here
    expect(memberData[id].name).toEqual(expected[id].name);
    expect(memberData[id].gender).toEqual(expected[id].gender);
    expect(memberData[id].imgURLs).toEqual(expected[id].imgURLs);
    expect(memberData[id].photoURL).toEqual(expected[id].photoURL);
    if (memberData[id].birthDate) {
      expect(memberData[id].birthDate.isSame(expected[id].birthDate)).toBeTruthy();
    }
  }
});
