import { Paper, Button, TextField, Dialog, Typography, Table, TableHead, TableRow, Tooltip, TableBody, TableCell, IconButton, TableContainer, Snackbar } from "@mui/material";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

export default function AdminResultTable({ queryResult }) {
    const [open, setSnackbar] = useState(false);
    const [snackMsg, setMsg] = useState('');
    const [courseData, setCourseData] = useState({});
    const [dialog, setdialog] = useState(false);

    const handleClose = () => setdialog(false);

    const editCourse = (data) => {
        const clone = { ...data };
        setCourseData(clone);
        console.log(clone);
        setdialog(true);
    }

    const modifyCourse = async () => {
        console.log(courseData);
        if (!(/^\d+$/.test(courseData.cnum))) {
            setMsg('Only numbers are allowed for Catalog Number');
            return setSnackbar(true);
        } else if (courseData.credit > 1) {
            setMsg('Credit cannot be bigger than 1');
            return setSnackbar(true);
        } else if (!(/\d\d:\d\d:\d\d/.test(courseData.starttime))) {
            setMsg('Start time must follow the format of hh:mm:ss');
            return setSnackbar(true);
        } else if (!(/\d\d:\d\d:\d\d/.test(courseData.endtime))) {
            setMsg('End time must follow the format of hh:mm:ss');
            return setSnackbar(true);
        }

        const response = await axios.put('/updateCourse', courseData);
        console.log(response.data);

        if (response.data === true) {
            setMsg('Course updated successfully');
        } else {
            setMsg(response.data);
        }
        return setSnackbar(true);
    }

    return (
        <>
            <Dialog onClose={handleClose} open={dialog}>
                <Paper>
                    <div style={{ width: '600px', height: '500px' }}>
                        <div style={{ margin: '1em 0', textAlign: 'center' }}>Editing Component</div>
                        <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '1em 0' }}>
                            <TextField onChange={(e) => setCourseData({ ...courseData, csub: e.target.value })} defaultValue={courseData.csub} label="Subject" size="small"></TextField>
                            <TextField onChange={(e) => setCourseData({ ...courseData, cnum: e.target.value })} defaultValue={courseData.cnum} label="Catalog Number" size="small"></TextField>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '1em 0' }}>
                            <TextField onChange={(e) => setCourseData({ ...courseData, credit: e.target.value })} defaultValue={courseData.credit} label="Credit" size="small"></TextField>
                            <TextField onChange={(e) => setCourseData({ ...courseData, enrollcap: e.target.value })} defaultValue={courseData.enrollcap} label="Class Capacity" size="small"></TextField>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '1em 0' }}>
                            <TextField onChange={(e) => setCourseData({ ...courseData, starttime: e.target.value })} defaultValue={courseData.starttime} label="Start Time" size="small"></TextField>
                            <TextField onChange={(e) => setCourseData({ ...courseData, endtime: e.target.value })} defaultValue={courseData.endtime} label="End Time" size="small"></TextField>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '1em 0' }}>
                            <TextField onChange={(e) => setCourseData({ ...courseData, campoff: e.target.value })} defaultValue={courseData.campoff} label="Delivery Type" size="small"></TextField>
                            <TextField onChange={(e) => setCourseData({ ...courseData, camploc: e.target.value })} defaultValue={courseData.camploc} label="Delivery Code" size="small"></TextField>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '1em 0' }}>
                            <TextField onChange={(e) => setCourseData({ ...courseData, building: e.target.value })} defaultValue={courseData.building} label="Buliding" size="small"></TextField>
                            <TextField onChange={(e) => setCourseData({ ...courseData, room: e.target.value })} defaultValue={courseData.room} label="Room Number" size="small"></TextField>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3em' }}>
                            <Button color="primary" variant="contained" style={{ marginRight: '4em' }} onClick={modifyCourse}>Update</Button>
                            <Button onClick={() => { setdialog(false) }}>Cancel</Button>
                        </div>
                    </div>
                </Paper>
            </Dialog>
            <Snackbar
                open={open}
                autoHideDuration={2000}
                message={snackMsg}
                onClose={() => setSnackbar(false)}
            />
            <div style={{ margin: '2em 0' }}>
                <Typography variant="overline">
                    <span>{queryResult.length} results found:</span>
                </Typography>
            </div>
            <TableContainer component={Paper} variant='outlined'>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Subject</TableCell>
                            <TableCell align="right">Course Code</TableCell>
                            <TableCell align="right">Type</TableCell>
                            <TableCell align="right">Location</TableCell>
                            <TableCell align="right">Capacity</TableCell>
                            <TableCell align="right">Time</TableCell>
                            <TableCell align="right">Edit</TableCell>
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
                                <TableCell align="right">{row.ctype}</TableCell>
                                <TableCell align="right">
                                    {row.campoff || ''}{row.camploc ? `(${row.camploc})` : ''} {row.building || 'N/A'}{row.room || ''}
                                </TableCell>
                                <TableCell align="right">{row.enrolltot}/{row.enrollcap}</TableCell>
                                <TableCell align="right">
                                    {
                                        row.weekday && row.starttime && row.endtime
                                            ? row.weekday + " " + row.starttime.slice(0, -3) + "-" + row.endtime.slice(0, -3)
                                            : <Tooltip title='This component does not have in-person activities' placement='top'><span>N/A</span></Tooltip>
                                    }
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => editCourse(row)}>
                                        <EditIcon></EditIcon>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}