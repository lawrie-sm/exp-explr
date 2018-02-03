import React from 'react';
import { Tab } from 'semantic-ui-react';
import SubLists from './SubLists';

const SelectorTabs = ({ partyData, commData, cpgData }) => {
  const panes = [
    {
      menuItem: partyData.title,
      pane: {
        key: partyData.title,
        content: <SubLists subLists={partyData.data} />,
      },
    },
    {
      menuItem: commData.title,
      pane: {
        key: commData.title,
        content: <SubLists subLists={commData.data} />,
      },
    },
    {
      menuItem: cpgData.title,
      pane: {
        key: cpgData.title,
        content: <SubLists subLists={cpgData.data} />,
      },
    },
  ];
  return (
    <Tab
      menu={{ secondary: true, pointing: true }}
      panes={panes}
      renderActiveOnly={false}
    />
  );
};

export default SelectorTabs;
