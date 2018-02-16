/*
  Tab and datepicker menu
  Each tab contains a series of lists, depending on the context.
  The datepicker portal button is included in the semantic-ui panes.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'semantic-ui-react';
import PaneContent from './PaneContent';
import SPDatePicker from './SPDatePicker';

const MainTabs = ({
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
        content: <PaneContent subLists={partyData.data} openModalCallback={openModalCallback} />,
      },
    },
    {
      menuItem: commData.title,
      pane: {
        key: commData.title,
        content: <PaneContent subLists={commData.data} openModalCallback={openModalCallback} />,
      },
    },
    {
      menuItem: cpgData.title,
      pane: {
        key: cpgData.title,
        content: <PaneContent subLists={cpgData.data} openModalCallback={openModalCallback} />,
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
      className="SelectorTabs"
      menu={{ secondary: true, pointing: true }}
      panes={panes}
      renderActiveOnly={false}
    />
  );
};

MainTabs.propTypes = {
  partyData: PropTypes.object.isRequired,
  commData: PropTypes.object.isRequired,
  cpgData: PropTypes.object.isRequired,
  selectedDate: PropTypes.object.isRequired,
  openModalCallback: PropTypes.func.isRequired,
  dateUpdateCallback: PropTypes.func.isRequired,
};

export default MainTabs;
