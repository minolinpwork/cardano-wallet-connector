import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import {Lottery} from './Lottery'
import { properties } from '../properties/properties.js'

export default class BasicTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }
    
    render() {
        const dev=properties.dev;
        const utxoSelected=this.props.selectedLottery?.utxo;
        return (
            <TableContainer component={Paper} sx={{ maxWidth: 500, justifyContent: 'center', }}>
            <Typography variant="h5" gutterBottom>
                Select a lottery
            </Typography>
            <Table size="small" aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Numbers</TableCell>
                    <TableCell align="right">Choices</TableCell>
                    <TableCell align="right">Prize</TableCell>
                    <TableCell align="right">Cost</TableCell>
                    {(dev) && <TableCell align="right">Winning Nos</TableCell>}
                </TableRow>
                </TableHead>
                <TableBody>
                {this.props.lotteries.map((row) => (  
                    <TableRow onClick={() => this.props.lotteryClick(row.utxo)}
                    key={row.utxo} selected={row.utxo==utxoSelected}
                    hover={true}
                    //sx={{ '&:last-child td, &:last-child th': { border: 2 } }}
                    >
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">{row.maxNo}</TableCell>
                    <TableCell align="right">{row.maxChoices}</TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                    <TableCell align="right">{row.cost}</TableCell>
                    {(dev) && <TableCell align="right">{row.selected().toString()}</TableCell>}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        );
    }
}