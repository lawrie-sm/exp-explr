/*
  Accordion for each sublist
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'semantic-ui-react';
import MemberList from './MemberList';

const PaneContent = ({ subLists, openModalCallback }) => {
  const subListPanels = subLists.map((subList) => (
    {
      title: subList.name,
      content: {
        content: <MemberList
          memberInfos={subList.memberInfos}
          openModalCallback={openModalCallback}
        />,
        key: subList.ID,
      },
    }
  ));
  return (
    <Accordion
      defaultActiveIndex={-1}
      panels={subListPanels}
    />
  );
};

PaneContent.propTypes = {
  subLists: PropTypes.object.isRequired,
  openModalCallback: PropTypes.func.isRequired,
};

export default PaneContent;
