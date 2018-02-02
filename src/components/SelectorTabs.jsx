import React from 'react';
import { Tab } from 'semantic-ui-react';
import SelectorTabContent from './SelectorTabContent';

const SelectorTabs = ({ partyData, commData, cpgData }) => {
  const panes = [
    {
      menuItem: partyData.title,
      render: () => (
        <Tab.Pane>
          <SelectorTabContent data={partyData.data} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: commData.title,
      render: () => (
        <Tab.Pane>
          <SelectorTabContent data={commData.data} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: cpgData.title,
      render: () => (
        <Tab.Pane>
          <SelectorTabContent data={cpgData.data} />
        </Tab.Pane>
      ),
    },
  ];
  return (<Tab menu={{ secondary: true, pointing: true }} panes={panes} />);
};

export default SelectorTabs;
