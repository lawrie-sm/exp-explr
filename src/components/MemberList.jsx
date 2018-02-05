/*
  Individual member lists within each accordion
  The list items return an MSP id from the onClick event
*/

import React from 'react';
import { List } from 'semantic-ui-react';

const MemberList = ({ memberInfos, openModalCallback }) => {
  const memberList = memberInfos.map((mi) => {
    const content = {
      id: mi.member.ID,
      header: mi.member.name,
      description: mi.roleTitle,
    };
    return (
      <List.Item
        key={mi.member.ID}
        content={content}
        onClick={openModalCallback}
      />
    );
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
