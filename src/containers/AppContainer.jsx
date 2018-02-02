/*
  Deals with high level state (loading) and stores data.
  Manages and updates the member list based on date picker.
*/

import React, { Component } from 'react';
import moment from 'moment';
import fetchCoreDataFromAPIs from '../data/fetchCoreDataFromAPIs';
import getMembers from '../data/getMembers';
import { getPartyList, getGroupList } from '../data/subLists';
import Spinner from '../components/Spinner';
import AppBody from '../components/AppBody';


class AppContainer extends Component {
  constructor() {
    super();
    this.handleDateUpdate = this.handleDateUpdate.bind(this);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    const selectedDate = moment();
    fetchCoreDataFromAPIs().then((coreData) => {
      this.setData(selectedDate, coreData);
    });
  }

  setData(selectedDate, coreData) {
    const members = getMembers(selectedDate, coreData);
    const partyData = { title: 'Party', data: getPartyList(members) };
    const commData = { title: 'Committee', data: getGroupList(members, 'committee') };
    const cpgData = { title: 'CPG', data: getGroupList(members, 'cpg') };
    this.setState({
      isLoading: false,
      selectedDate,
      partyData,
      commData,
      cpgData,
    });
  }

  // Handles the click event on updating the date
  // (We could cache coreData, but it's pretty big
  // and we need all of it to cover all possible dates)
  handleDateUpdate(selectedDate) {
    this.setState({ isLoading: true });
    fetchCoreDataFromAPIs().then((coreData) => {
      this.setData(selectedDate, coreData);
    });
  }
  render() {
    if (!this.state.isLoading) {
      console.log(this.state);
      return (
        <div className="AppContainer">
          <AppBody
            partyData={this.state.partyData}
            commData={this.state.commData}
            cpgData={this.state.cpgData}
          />
        </div>
      );
    } return (
      <Spinner />
    );
  }
}

export default AppContainer;
