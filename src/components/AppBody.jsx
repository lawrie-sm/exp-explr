/*
  A stateless component for layout purposes.
*/

import React from 'react';
import SelectorTabs from './SelectorTabs';
import SPDatePicker from './SPDatePicker';

class AppBody extends React.PureComponent {
  render() {
    return(
      <div className="AppBody">
        <SPDatePicker
          selectedDate={this.props.selectedDate}
          dateUpdateCallback={this.props.dateUpdateCallback}
        />
        <SelectorTabs
          partyData={this.props.partyData}
          commData={this.props.commData}
          cpgData={this.props.cpgData}
          openModalCallback={this.props.openModalCallback}
        />
      </div>
    );
  }
}

export default AppBody;
