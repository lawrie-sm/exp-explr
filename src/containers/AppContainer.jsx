/*
  Container for the member data.
  Manages and updates the member list based on pickers.
*/

import React, { Component } from 'react';
import MemberList from '../components/MemberList';
import getMemberDict from '../data/getMemberDict';

class AppContainer extends Component {
  constructor() {
    super();
    this.state = {
      selectedDate: undefined,
      memberDict: undefined,
    };
  }

  componentDidMount() {
    const selectedDate = new Date();
    getMemberDict().then((memberDict) => {
      this.setState({
        memberDict,
        selectedDate,
      });
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
