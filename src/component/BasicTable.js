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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default class BasicTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }
    
    render() {
        return (
            <TableContainer component={Paper} sx={{ maxWidth: 500 }}>
            <Typography variant="h4" gutterBottom>
                Select a lottery
            </Typography>
            <Table size="small" aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Numbers</TableCell>
                    <TableCell align="right">Choices</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {this.props.lotteries.map((row) => (
                    <TableRow
                    key={row.name}
                    //sx={{ '&:last-child td, &:last-child th': { border: 2 } }}
                    >
                    <TableCell component="th" scope="row">
                        <Button onClick={() => this.props.lotteryClick(row.name)}>{row.name}</Button>
                    </TableCell>
                    <TableCell align="right">{row.maxNo}</TableCell>
                    <TableCell align="right">{row.maxChoices}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        );
    }
}