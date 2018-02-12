/*
  A stateless component for layout purposes.
*/

import React from 'react';
import { Header } from 'semantic-ui-react';
import SelectorTabs from './SelectorTabs';
import SPDatePicker from './SPDatePicker';


class AppBody extends React.PureComponent {
  render() {
    return (
      <div className="AppBody">
        <div className="TopBar">
          <Header as="h1">MSP Data</Header>
          <SPDatePicker
            selectedDate={this.props.selectedDate}
            dateUpdateCallback={this.props.dateUpdateCallback}
          />
        </div>
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
