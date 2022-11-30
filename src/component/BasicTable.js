import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Lottery} from './Lottery'

export default class BasicTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }
    
    render() {
        const utxoSelected=this.props.selectedLottery?.utxo;
        return (
            <TableContainer component={Paper} sx={{ maxWidth: 500, justifyContent: 'center', }}>
            <Typography variant="h4" gutterBottom>
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
                    <TableCell align="right">Winning Nos</TableCell>
                    <TableCell align="right">Players</TableCell>
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
                    <TableCell align="right">{row.selected().toString()}</TableCell>
                    <TableCell align="right">{row.utxos.length-1}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        );
    }
}