import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';

export default function ResultTable({ queryResult }) {
    if (queryResult.length === 0) {
        return (
            <div style={{ margin: '8em 0' }}>
                <Typography variant="subtitle1">
                    <span>We did not find any results matching the criteria...</span>
                </Typography>
            </div>
        );
    }

    return (
        <>
            <div style={{ margin: '2em 0' }}>
                <Typography variant="overline">
                    <span>{queryResult.length} results found:</span>
                </Typography>
            </div>
            <TableContainer component={Paper} elevation='0' variant='outlined'>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Subject</TableCell>
                            <TableCell align="right">Course Code</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {queryResult.map((row, i) => (
                            <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="right">{row.csub}</TableCell>
                                <TableCell align="right">{row.cnum}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
