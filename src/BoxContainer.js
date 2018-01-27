import React, {Component} from 'react';

import './BoxContainer.css';
import Box from './Box';

export default class BoxContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boxes: [0, 1],
    };
    this.addBox = this.addBox.bind(this);
  }
  addBox() {
    const biggestExistingId = this.state.boxes[this.state.boxes.length - 1];
    this.setState({boxes: this.state.boxes.concat(biggestExistingId + 1)});
  }
  removeBox(boxId) {
    const indexToRemove = this.state.boxes.findIndex(id => id === boxId);
    this.setState({
      boxes: this.state.boxes
        .slice(0, indexToRemove)
        .concat(this.state.boxes.slice(indexToRemove + 1)),
    });
  }
  render() {
    return (
      <div className="container">
        {this.state.boxes
          .map(boxId => <Box key={boxId} close={() => this.removeBox(boxId)} />)
          .concat(
            <button className="add-box-button" onClick={this.addBox} key="button">
              +
            </button>
          )}
      </div>
    );
  }
}
