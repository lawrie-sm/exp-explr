import React from 'react';
import { Tab } from 'semantic-ui-react';
import SubLists from './SubLists';

const SelectorTabs = ({
  partyData,
  commData,
  cpgData,
  openModalCallback,
}) => {
  const panes = [
    {
      menuItem: partyData.title,
      pane: {
        key: partyData.title,
        content: <SubLists subLists={partyData.data} openModalCallback={openModalCallback} />,
      },
    },
    {
      menuItem: commData.title,
      pane: {
        key: commData.title,
        content: <SubLists subLists={commData.data} openModalCallback={openModalCallback} />,
      },
    },
    {
      menuItem: cpgData.title,
      pane: {
        key: cpgData.title,
        content: <SubLists subLists={cpgData.data} openModalCallback={openModalCallback} />,
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
