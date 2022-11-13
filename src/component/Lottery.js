import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function byteToHex(num) {
    // Turns a number (0-255) into a 2-character hex number (00-ff)
    var x = (16+num).toString(16);
    var y = (32+num).toString(16);
    var col = "#"+x+y+x;
    console.log("byteToHex: " + num + " " + col);
    return col;
}

function stringAvatar(name, selected) {
  return {
    sx: {
        bgcolor: selected ? '#D21B1E' : '#040303',
        width: 40,
        height: 40,
        fontSize: 18,
    },
    children: `${name}`,
  };
}

function LetterAvatar(props) {
    return (
        <IconButton onClick={props.onClick} sx={{ padding: "1px" }}>
            <Avatar {...stringAvatar(props.value, props.selected)}/>
        </IconButton>
    );
}

class LottoNumbers extends React.Component {
    constructor(props) {
      super(props);
    }

    renderButton(i) {
        return (
          <LetterAvatar key={i} value={i} selected={this.props.choices[i]} onClick={() => this.props.onClick(i)}/>
        );
    }


    render() {
        const choices = this.props.choices.map((choice, index) => {
            if (index>0) {
                return (
                    <Grid item key={index}>
                            {this.renderButton(index)}
                    </Grid>
                );
            }
          });

        return (
            <Grid container>
                <Grid item xs={2} md={2}></Grid>
                <Grid item xs={10} md={10}>
                    <Grid container>
                        {choices}
                    </Grid>
                </Grid>
                <Grid item xs={2} md={2}></Grid>
            </Grid>
        );
    }
}

export class Lottery {
    constructor(name, maxNo, maxChoices) {
        this.name = name;
        this.maxNo = maxNo;
        this.maxChoices = maxChoices;
        this.choices = new Array(maxNo+1).fill(false);
    }

    setMaxNo(maxNo) {
        this.maxNo = maxNo;
        this.choices = new Array(maxNo+1).fill(false);
    }

    selected() {
        const selected = new Array(this.maxChoices);
        this.choices.map((chosen, ind) => {  
            if (chosen) {
                selected.push(ind)
            }
        });
        console.log("selected", selected);
        return selected;
    }

    countTrue() {
        const count = this.choices.filter(obj => { return obj; }).length;
        console.log("countTrue", count);
        return count;
    }    
}

export default class LottoView extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    handleClick(i) {
        console.log("handleClick: " + i)
        const maxChoices = this.props.lottery.maxChoices;
        const choices = this.props.lottery.choices;
        //console.log("handleClick maxChoices: " + maxChoices)
        //console.log("handleClick choices before: " + choices)
        if (this.props.lottery.countTrue()<maxChoices || choices[i]) {
            console.log("handleClick changing: " + i)
            choices[i]=!choices[i]
            this.setState({choices: choices});
        }
        //console.log("handleClick choices after: " + choices)
    }

    render() {
        const name = this.props.lottery.name;
        const choices = this.props.lottery.choices;
        const maxChoices = this.props.lottery.maxChoices;

        //console.log("render choices: " + choices)


        let chosen = choices.map((choice, index) => {
            //console.log("render map: " + index + " " + choice)
            if (choice) {
                return (
                    <LetterAvatar key={index} value={index} selected={true}/>
                );
            }
          });
        const remaining = maxChoices - this.props.lottery.countTrue()
        console.log("remaining: " + remaining)
        console.log("chosen: " + chosen)
        let c1 = chosen;
        for (let i = 0; i < remaining; i++) {
            chosen.push ( 
                <LetterAvatar key={i} value={" "} selected={true}/>            )
          }

        return (

            <div>

          <Typography variant="h4" gutterBottom>
            {name}
          </Typography>
          <Typography variant="h4" gutterBottom>
            Pick your {maxChoices} lucky numbers:
          </Typography>
          <LottoNumbers
              choices={choices}
              onClick={(i) => this.handleClick(i)}
            />
            <br></br>
            <Typography variant="h4" gutterBottom>
            Your {maxChoices} chosen numbers:
          </Typography>
                <div>{chosen}</div>
            <br></br>
                <Button variant="contained">Play</Button>

            </div>
        );
    }
}


