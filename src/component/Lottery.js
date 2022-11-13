import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

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
        width: 30,
        height: 30,
        fontSize: 14,
    },
    children: `${name}`,
  };
}

function LetterAvatar(props) {
    return (
        <IconButton onClick={props.onClick}>
            <Avatar {...stringAvatar(props.value, props.selected)}/>
        </IconButton>
    );
}

function countTrue(arr) {
    const count = arr.filter(obj => { return obj; }).length;
    console.log("countTrue", count);
    return count;
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
                <Grid item xs={3}></Grid>
                <Grid item xs={6}>
                    <Grid container>
                        {choices}
                    </Grid>
                </Grid>
                <Grid item xs={3}></Grid>
            </Grid>
        );
    }
}

export class Lottery {
    constructor(maxNo, maxChoices) {
        this.maxNo = maxNo;
        this.maxChoices = maxChoices;
        this.choices = new Array(maxNo).fill(false);
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
        console.log("handleClick maxChoices: " + maxChoices)
        console.log("handleClick choices before: " + choices)
        if (countTrue(choices)<maxChoices || choices[i]) {
            console.log("handleClick changing: " + i)
            choices[i]=!choices[i]
            this.setState({choices: choices});
        }
        console.log("handleClick choices after: " + choices)
    }

    render() {
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
        const remaining = maxChoices - countTrue(choices)
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
            Pick your lucky numbers:
          </Typography>
          <LottoNumbers
              choices={choices}
              onClick={(i) => this.handleClick(i)}
            />
            <br></br>
            <Typography variant="h4" gutterBottom>
            Your chosen numbers:
          </Typography>
                <div>{chosen}

                </div>
            </div>
        );
    }
}


