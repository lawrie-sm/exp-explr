/*
  Individual lists of members, for a particular party or committee
*/

import React from 'react';
import { List } from 'semantic-ui-react';
import MemberListItem from './MemberListItem';

const MemberList = ({ memberInfos, openModalCallback }) => {
  const memberList = memberInfos.map((mi) => (
    <MemberListItem
      key={mi.member.ID}
      memberInfo={mi}
      openModalCallback={openModalCallback}
    />
  ));
  return (
    <List
      animated
      relaxed
      content={memberList}
    />
  );
};

export default MemberList;
