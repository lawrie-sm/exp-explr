/* eslint-env jest */

import React from 'react';
import ReactDOM from 'react-dom';
import MemberListItem from './MemberListItem';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const memberInfo = {
    member: {
      imgURLs: {
        small: './img/members/small/AlisonJohnstone.jpg',
      },
      name: 'Alison Johnstone',
      party: {
        name: 'Scottish Green Party',
        abbreviation: 'Green',
        ID: 4,
        membershipID: 628,
      },
      photoURL: 'http://scottishparliament.thirdlight.com/file/35818497919',
      region: 'Lothian',
    },
    rank: 2,
    roleTitle: 'Deputy Convener',
  };
  ReactDOM.render(<MemberListItem
    memberInfo={memberInfo}
    openModalCallback={() => {}}
  />, div);
});
