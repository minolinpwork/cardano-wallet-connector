import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Slider from '@mui/material/Slider';

export default class NewLottery extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    handleCheck = () => {
        console.log("check: " + this.input);
        console.log("check 2: " + this.props.lottery.name);
      };

      handleChange = (e) => {
        this.props.lottery.name = e.target.value;
        //this.setState({[e.target.name]: e.target.value})
      }

    render() {
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch', },
      }}
      noValidate
      autoComplete="off"
      ml={3}
      mr={3}
    >
      <Typography variant="h4" gutterBottom>
        Parameters for your Lottery
      </Typography>


      <TextField  
        required
        id="name"
        //defaultValue="Dummy"
        label="Name of Lottery"
        onChange={(e) => this.props.handleLotteryNameChange(e.target.value)}
        sx={{ mt: 2, mb: 6 }}
        inputProps={{ maxLength: 10 }}
        //onChange={(e) => this.props.lottery.name=e.target.value}
        //onChange={(e) => console.log(e.target.value)}
        //onChange={this.handleChange}//ref={myinput => (this.input = myinput)}
      />


      <Typography id="maxNo-slider" gutterBottom mt={5} mb={4}>
        Range of numbers available - from 1 to 99
      </Typography>
      <Slider 
        min={1}
        max={99}
        step={1}
        //defaultValue={this.props.lottery.maxNo}
        defaultValue={1}
        valueLabelDisplay="on"
        onChange={(e) => this.props.handleLotteryMaxNoChange(e.target.value)}
        aria-labelledby="input-slider"
      />


      <Typography id="maxChoices-slider" gutterBottom mt={5} mb={4}>
        How many numbers to choose - From 1 to 7
      </Typography>
      <Slider
        min={1}
        max={7}
        step={1}
        defaultValue={1}
        valueLabelDisplay="on"
        onChange={(e) => this.props.handleLotteryMaxChoicesChange(e.target.value)}
        aria-labelledby="input-slider"
      />

      <Typography id="amount-slider" gutterBottom mt={5} mb={4}>
        Prize (ADA) - From 10 to ...
      </Typography>
      <Slider
        min={10}
        max={100}
        step={1}
        defaultValue={10}
        valueLabelDisplay="on"
        onChange={(e) => this.props.handleLotteryAmountChange(e.target.value)}
        aria-labelledby="input-slider"
      />

      <Typography id="feeToPlay-slider" gutterBottom mt={5} mb={4}>
        Cost to Play (ADA) - From 3 to ...
      </Typography>
      <Slider
        min={3}
        max={100}
        step={1}
        defaultValue={3}
        valueLabelDisplay="on"
        onChange={(e) => this.props.handleLotteryCostChange(e.target.value)}
        aria-labelledby="input-slider"
      />



    </Box>
  );
    }
}