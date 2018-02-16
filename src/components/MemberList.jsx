/*
  Individual lists of members, for a particular party or committee
*/

import React from 'react';
import PropTypes from 'prop-types';
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

MemberList.propTypes = {
  memberInfos: PropTypes.object.isRequired,
  openModalCallback: PropTypes.func.isRequired,
};

export default MemberList;
