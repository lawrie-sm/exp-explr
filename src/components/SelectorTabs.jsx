import React from 'react';
import { Tab } from 'semantic-ui-react';
import SelectorTabContent from './SelectorTabContent';

const panes = [
  {
    menuItem: 'Party',
    render: () => (
      <Tab.Pane>
        <SelectorTabContent />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Committee',
    render: () => (
      <Tab.Pane>
        <SelectorTabContent />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'CPG',
    render: () => (
      <Tab.Pane>
        <SelectorTabContent />
      </Tab.Pane>
    ),
  },
];

const SelectorTabs = () => (
  <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
);

export default SelectorTabs;
