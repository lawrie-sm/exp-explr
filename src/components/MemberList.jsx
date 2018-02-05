/*
  Individual member lists within each accordion
  The list items return an MSP id from the onClick event
*/

import React from 'react';
import { Image, List } from 'semantic-ui-react';

const MemberList = ({ memberInfos, openModalCallback }) => {
  const memberList = memberInfos.map((mi) => {
    return (
      <List.Item key={mi.member.ID} onClick={() => openModalCallback(mi.member.ID)}>
        <Image avatar src="http://via.placeholder.com/24x24" />
        <List.Content>
          <List.Header>{mi.member.name}</List.Header>
          <List.Description>{mi.roleTitle}</List.Description>
        </List.Content>
      </List.Item>
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
