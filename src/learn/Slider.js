import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
  return `${value}`;
}

const minDistance = 10;

export default class MinimumDistanceSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      value1: [20, 37],
      value2: [5, 10, 15, 20, 30, 40]
    };
  }

  handleChange1 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      this.setState({value1: ([Math.min(newValue[0], this.state.value1[1] - minDistance), this.state.value1[1]]) });
    } else {
      this.setState({value1: ([this.state.value1[0], Math.max(newValue[1], this.state.value1[0] + minDistance)]) });
    }
  };


  handleChange2 = (event, newValue, activeThumb) => {
    console.log("activeThumb: " + activeThumb)
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        this.setState({value2: ([clamped, clamped + minDistance]) });
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        this.setState({value2: ([clamped - minDistance, clamped]) });
      }
    } else {
      this.setState({value2: (newValue) });
    }
    console.log("Min1 Slider Internal: " + newValue[1]);
    this.props.onChange(newValue[1])
  };

    render() {
      return (
        <Box sx={{ width: 300 }}>
        <Slider
          getAriaLabel={() => 'Minimum distance'}
          value={this.state.value1}
          onChange={this.handleChange1}
          valueLabelDisplay="on"
          getAriaValueText={valuetext}
        />
        <Slider
          getAriaLabel={() => 'Minimum distance shift'}
          value={this.state.value2}
          onChange={this.handleChange2}
          valueLabelDisplay="on"
          getAriaValueText={valuetext}
        />
      </Box>
      );
    }


  }