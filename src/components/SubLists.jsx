/*
  Accordion for each sublist (party, cpg, committee)
*/

import React from 'react';
import { Accordion } from 'semantic-ui-react';
import MemberList from './MemberList';

const SubLists = ({ subLists, openModalCallback }) => {
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

export default SubLists;
