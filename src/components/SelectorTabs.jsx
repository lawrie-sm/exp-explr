/*
  Tab and datepicker menu
  Each tab contains a series of lists, depending on the context.
*/

import React from 'react';
import { Tab, Menu } from 'semantic-ui-react';
import SubLists from './SubLists';
import SPDatePicker from './SPDatePicker';

const SelectorTabs = ({
  partyData,
  commData,
  cpgData,
  selectedDate,
  openModalCallback,
  dateUpdateCallback,
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
    {
      menuItem: (
        <SPDatePicker
          key="DatePicker"
          selectedDate={selectedDate}
          dateUpdateCallback={dateUpdateCallback}
        />
      ),
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
