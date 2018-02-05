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
import MemberModal from '../components/MemberModal';


class AppContainer extends Component {
  constructor() {
    super();
    this.dateUpdateCallback = this.dateUpdateCallback.bind(this);
    this.openModalCallback = this.openModalCallback.bind(this);
    this.closeModalCallback = this.closeModalCallback.bind(this);
    this.state = { isLoading: true, modalIsOpen: false };
  }

  componentDidMount() {
    const selectedDate = moment();
    fetchCoreDataFromAPIs().then((coreData) => {
      this.setData(selectedDate, coreData);
    });
  }

  setData(selectedDate, coreData) {
    const memberData = getMembers(selectedDate, coreData);
    const partyData = { title: 'Party', data: getPartyList(memberData) };
    const commData = { title: 'Committee', data: getGroupList(memberData, 'committee') };
    const cpgData = { title: 'CPG', data: getGroupList(memberData, 'cpg') };
    this.setState({
      isLoading: false,
      modalIsOpen: false,
      selectedMember: undefined,
      selectedDate,
      memberData,
      partyData,
      commData,
      cpgData,
    });
  }

  // Handles the click event on updating the date
  dateUpdateCallback(selectedDate) {
    this.setState({ isLoading: true });
    fetchCoreDataFromAPIs().then((coreData) => {
      this.setData(selectedDate, coreData);
    });
  }

  // Modal callback uses the onClick data to get MSP ID
  openModalCallback(e, data) {
    const selectedMember = this.state.memberData.find((m) => m.ID == data.content.id);
    this.setState({ modalIsOpen: true, selectedMember });
  }

  closeModalCallback() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    if (!this.state.isLoading) {

      return (
        <div className="AppContainer">
          <MemberModal
            modalIsOpen={this.state.modalIsOpen}
            selectedMember={this.state.selectedMember}
            closeModalCallback={this.closeModalCallback}
          />
          <AppBody
            selectedDate={this.state.selectedDate}
            dateUpdateCallback={this.dateUpdateCallback}
            openModalCallback={this.openModalCallback}
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
