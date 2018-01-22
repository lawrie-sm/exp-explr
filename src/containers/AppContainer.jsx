/*
  Container for the member data.
  Manages and updates the member list based on pickers.
*/

import React, { Component } from 'react';
import MemberList from '../components/MemberList';
import getMemberData from '../api/getMemberData';

class AppContainer extends Component {
  constructor() {
    super();
    this.state = {
      memberData: undefined,
    };
  }

  componentDidMount() {
    getMemberData().then((memberData) => {
      this.setState({ memberData });
      console.log(memberData)
    });
  }

  render() {
    return (
      <div className="AppContainer">
        <MemberList members={this.state.memberData} />
      </div>
    );
  }
}

export default AppContainer;
