/*
  A stateless component for layout purposes.
*/

import React from 'react';
import SelectorTabs from './SelectorTabs';
import SPDatePicker from './SPDatePicker';

const AppBody = ({
  selectedDate,
  dateUpdateCallback,
  partyData,
  commData,
  cpgData,
}) => (
  <div className="AppBody">
    <SPDatePicker
      selectedDate={selectedDate}
      dateUpdateCallback={dateUpdateCallback}
    />
    <SelectorTabs
      partyData={partyData}
      commData={commData}
      cpgData={cpgData}
    />
  </div>
);

export default AppBody;
