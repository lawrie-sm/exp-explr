/*
  A stateless component for layout purposes.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import MainTabs from './MainTabs';

class AppBody extends React.PureComponent {
  render() {
    return (
      <div className="AppBody">
        <div className="TopBar">
          <Header as="h1">MSP Data</Header>
        </div>
        <MainTabs
          partyData={this.props.partyData}
          commData={this.props.commData}
          cpgData={this.props.cpgData}
          selectedDate={this.props.selectedDate}
          openModalCallback={this.props.openModalCallback}
          dateUpdateCallback={this.props.dateUpdateCallback}
        />
      </div>
    );
  }
}

AppBody.propTypes = {
  partyData: PropTypes.object.isRequired,
  commData: PropTypes.object.isRequired,
  cpgData: PropTypes.object.isRequired,
  selectedDate: PropTypes.object.isRequired,
  openModalCallback: PropTypes.func.isRequired,
  dateUpdateCallback: PropTypes.func.isRequired,
};

export default AppBody;
