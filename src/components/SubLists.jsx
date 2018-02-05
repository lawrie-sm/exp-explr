/*
  Accordion for each sublist (party, cpg, committee)
*/

import React, { Component } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import MemberList from './MemberList';

class SubLists extends Component {

  render() {
    const subListPanels = this.props.subLists.map((subList) => {
      return ({
        title: subList.name,
        content: {
          content: <MemberList memberInfos={subList.memberInfos} openModalCallback={this.props.openModalCallback} />,
          key: subList.ID,
        },
      });
    });
    return (
      <Accordion
        defaultActiveIndex={-1}
        panels={subListPanels}
      />
    );
  }
}

export default SubLists;
