import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Slider from '@mui/material/Slider';
import { properties } from '../properties/properties';

export default class NewLottery extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    product_Range(a,b) {
      var prd = a,i = a;
     
      while (i++< b) {
        prd*=i;
      }
      return prd;
    }
        
    combinations(n, r) 
    {
      if (n==r || r==0) 
      {
        return 1;
      } 
      else 
      {
        r=(r < n-r) ? n-r : r;
        return this.product_Range(r+1, n)/this.product_Range(1,n-r);
      }
    }

    handleLotteryNameChange = (input) => {
      const lottery = this.props.lottery;
      lottery.name = input;
      this.props.updateFromNewLottery(lottery);
    }
    handleLotteryMaxNoChange = (input) => {
      //console.log("handleLotteryMaxNoChange: " + input)
      const lottery = this.props.lottery;
      lottery.setMaxNo(input);
      if (input<lottery.maxChoices) {
        lottery.setMaxChoices(input);
      }
      this.props.updateFromNewLottery(lottery);
      //console.log("handleLotteryMaxNoChange: " + JSON.stringify(this.state.selectedLottery, null, 4))
    }
    handleLotteryMaxChoicesChange = (input) => {
      const lottery = this.props.lottery;
      lottery.setMaxChoices(input);
      if (lottery.maxChoices>lottery.maxNo) {
        lottery.setMaxNo(lottery.maxChoices);
      }
      this.props.updateFromNewLottery(lottery);
      //console.log("handleLotteryMaxNoChange: " + JSON.stringify(this.state.selectedLottery, null, 4))
    }
    handleLotteryAmountChange = (input) => {
      const lottery = this.props.lottery;
      lottery.amount = input;
      this.props.updateFromNewLottery(lottery);
    }
    handleLotteryCostChange = (input) => {
      const lottery = this.props.lottery;
      lottery.cost = input;
      this.props.updateFromNewLottery(lottery);
    }

    render() {
      var lottery = this.props.lottery;

      const chanceOfWinning = this.combinations(lottery.maxNo, lottery.maxChoices)
      const roiAda = Math.round((lottery.cost-properties.profitAmount/1000000)*100)
      const roiPerFor100Players = Math.round( roiAda / lottery.amount*100);
      //const maxChoices = Math.min(lottery.maxNo, 7)

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
      <Typography variant="h5" gutterBottom>
        Parameters for your Lottery
      </Typography>


      <TextField  
        required
        id="name"
        defaultValue={properties.newLotteryMinName}
        //defaultValue="Dummy"
        label="Name of Lottery"
        onChange={(e) => this.handleLotteryNameChange(e.target.value)}
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
        value={lottery.maxNo}
        min={properties.newLotteryMinMaxNo}
        max={properties.newLotteryMaxMaxNo}
        step={1}
        //defaultValue={this.props.lottery.maxNo}
        valueLabelDisplay="on"
        onChange={(e) => this.handleLotteryMaxNoChange(e.target.value)}
        aria-labelledby="input-slider"
      />


      <Typography id="maxChoices-slider" gutterBottom mt={5} mb={4}>
        How many numbers to choose - From 1 to 7
      </Typography>
      <Slider
        value={lottery.maxChoices}
        min={properties.newLotteryMinMaxChoices}
        max={properties.newLotteryMaxMaxChoices}
        step={1}
        valueLabelDisplay="on"
        onChange={(e) => this.handleLotteryMaxChoicesChange(e.target.value)}
        aria-labelledby="input-slider"
      />

      <Typography id="amount-slider" gutterBottom mt={5} mb={4}>
        Prize (ADA) - From 10 to ...
      </Typography>
      <Slider
        value={lottery.amount}
        min={properties.newLotteryMinAmount}
        max={properties.newLotteryMaxAmount}
        step={1}
        valueLabelDisplay="on"
        onChange={(e) => this.handleLotteryAmountChange(e.target.value)}
        aria-labelledby="input-slider"
      />

      <Typography id="feeToPlay-slider" gutterBottom mt={5} mb={4}>
        Cost to Play (ADA) - From 3 to ...
      </Typography>
      <Slider
        value={lottery.cost}
        min={properties.newLotteryMinCost}
        max={properties.newLotteryMaxCost}
        step={1}
        valueLabelDisplay="on"
        onChange={(e) => this.handleLotteryCostChange(e.target.value)}
        aria-labelledby="input-slider"
      />


    <Typography id="changeOfWinning" gutterBottom mt={5}>
        Chance of Winning: 1 in {chanceOfWinning}
    </Typography>
    <Typography id="changeOfWinning" gutterBottom>
        ROI for 100 players: {roiPerFor100Players}% or {roiAda} ADA
    </Typography>

    </Box>
  );
    }
}