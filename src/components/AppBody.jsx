/*
 For layout purposes
*/

import React, { Component } from 'react';
import SelectorTabs from './SelectorTabs';

const AppBody = ({ partyData, commData, cpgData }) => (
  <div className="AppBody">
    <SelectorTabs
      partyData={partyData}
      commData={commData}
      cpgData={cpgData}
    />
  </div>
);

export default AppBody;
