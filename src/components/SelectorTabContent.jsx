import React, { Component } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'

class SelectorTabContent extends Component {
  state = { activeIndex: -1 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state
    console.log(this.props);
    return (
      'TODO'
    )
  }
}

export default SelectorTabContent;