/*
  Individual member lists within each accordion
*/

import React from 'react';
import { List } from 'semantic-ui-react';

const MemberList = ({ memberInfos, openModalCallback }) => {
  const memberList = memberInfos.map((mi) => {
    const content = {
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
