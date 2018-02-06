/*
  Individual member lists within each accordion
  The list items return an MSP id from the onClick event
*/

import React from 'react';
import { Image, List } from 'semantic-ui-react';
import MemberListItem from './MemberListItem';

const MemberList = ({ memberInfos, openModalCallback}) => {
  const memberList = memberInfos.map((mi) => {
    return (<MemberListItem key={mi.member.ID} member={mi.member} openModalCallback={openModalCallback} />);
  });
  return (
    <List
      animated
      relaxed
      content={memberList}
    />
  );
};

export default MemberList;
