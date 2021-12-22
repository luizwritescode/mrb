import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const rows = [ {
    name: 'BTC',
    amount: 1,
    value: 5
} ]


export default function BasicTable() {
    return (
      <TableContainer sx={{ width:'100%' }} component={Paper}>
        <Table  aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Coin</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Value (BTC)</TableCell>
              <TableCell align="right">Value (USD)</TableCell>
              <TableCell align="right">Value (BRL)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.amount}</TableCell>
                <TableCell align="right">{row.value}</TableCell>
                <TableCell align="right">{row.value}</TableCell>
                <TableCell align="right">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }