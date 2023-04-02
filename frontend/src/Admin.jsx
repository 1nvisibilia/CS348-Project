import { useState } from "react";
import { Box, FormControl, Paper, InputLabel, Select, TextField, MenuItem, Button, Typography } from "@mui/material";
import { courseSubs } from './courseSubjects';
import axios from "axios";
import AdminResultTable from './AdminResultTable';

export default function Admin({ user }) {
    const [courseSub, setCourseSub] = useState('Any');
    const [courseCode, setCourseCode] = useState('');
    const [avail, setAvail] = useState('All');
    const [courseType, setCourseType] = useState('Any');
    // advanced queries
    const [courseName, setCourseName] = useState('');
    const [credit, setCredit] = useState('Any');
    const [campusOff, setCampusOff] = useState('Any');
    const [building, setBuilding] = useState('');
    const [room, setRoom] = useState('');
    const [numberValidity, setValid] = useState(true);
    const [matchAll, setMatchAll] = useState(true);
    const [queryResult, setResult] = useState(null);

    const checkNumberValidity = (courseNum) => {
        const valid = courseNum === '' || (0 < parseInt(courseNum) && parseInt(courseNum) < 1000);
        setValid(valid);
        return valid;
    }

    const updateCallbackFn = (newData) => {
        const idx = queryResult.findIndex((e) => e.id === newData.id);
        if (idx === -1) return;
        queryResult[idx] = newData;
        setResult(queryResult);
    }

    const searchQuery = async () => {
        const response = await axios.get('/search', {
            params: {
                courseSub: courseSub === 'Any' ? null : courseSub,
                courseCode: courseCode === '' ? null : courseCode,
                avail: avail === 'All' ? null : avail,
                courseType: courseType === 'Any' ? null : courseType,

                courseName: (courseName === '') ? null : courseName,
                credit: (credit === 'Any') ? null : credit,
                campusOff: (credit === 'Any') ? null : campusOff,
                building: (building === '') ? null : building,
                room: (room === '') ? null : room,

                searchAll: matchAll
            }
        });
        setResult(response.data);
    };

    return (
        <Paper style={{ margin: '0 4em', padding: '2em' }}>
            <div style={{ margin: '1em 0 3em' }}>
                <Typography >Admin Page</Typography>
            </div>
            <div>
                <Box style={{ margin: '0 0 2em', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <FormControl>
                        <InputLabel>Course Name</InputLabel>
                        <Select sx={{ width: 120 }}
                            id="demo-simple-select"
                            value={courseSub}
                            label="Age"
                            onChange={(event) => setCourseSub(event.target.value)}
                            displayEmpty
                            variant='standard'
                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                        >
                            {
                                courseSubs.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <FormControl>
                        <TextField
                            id="standard-basic" label="Course Code" variant="standard"
                            placeholder="Any"
                            style={{ width: '100px' }}
                            type='number' error={!numberValidity}
                            onChange={(event) => checkNumberValidity(event.target.value) && setCourseCode(event.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <InputLabel>Availability</InputLabel>
                        <Select sx={{ width: 100 }}
                            id="demo-simple-select"
                            value={avail}
                            onChange={(event) => setAvail(event.target.value)}
                            displayEmpty
                            variant='standard'
                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                        >
                            {
                                ['Available Only', 'All'].map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel>Course Type</InputLabel>
                        <Select sx={{ width: 100 }}
                            id="demo-simple-select"
                            value={courseType}
                            onChange={(event) => setCourseType(event.target.value)}
                            displayEmpty
                            variant='standard'
                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                        >
                            {
                                ['Any', 'LEC', 'TUT', 'TST', 'LAB'].map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Box>

                <Box style={{ margin: '0 0 2em', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <FormControl>
                        <TextField
                            id="standard-basic" label="Course Name" variant="standard"
                            value={courseName} type="search"
                            style={{ width: '100px' }}
                            onChange={(event) => setCourseName(event.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <InputLabel>Credit</InputLabel>
                        <Select sx={{ width: 120 }}
                            id="demo-simple-select"
                            value={credit}
                            onChange={(event) => setCredit(event.target.value)}
                            displayEmpty
                            variant='standard'
                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                        >
                            {
                                ['Any', '0.5', '0.25'].map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel>Campus Location</InputLabel>
                        <Select sx={{ width: 120 }}
                            id="demo-simple-select"
                            value={campusOff}
                            onChange={(event) => setCampusOff(event.target.value)}
                            displayEmpty
                            variant='standard'
                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                        >
                            {
                                ['Any', 'UW', 'ONLN'].map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <FormControl>
                        <TextField
                            id="standard-basic" label="Building" variant="standard"
                            value={building} type="search"
                            style={{ width: '100px' }}
                            onChange={(event) => setBuilding(event.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            id="standard-basic" label="Room" variant="standard"
                            value={room} type="search"
                            style={{ width: '100px' }}
                            onChange={(event) => setRoom(event.target.value)}
                        />
                    </FormControl>
                </Box>
            </div>
            <Button
                style={{ margin: '0 1em' }}
                variant="contained" onClick={() => { setMatchAll(!matchAll) }}>
                {matchAll ? 'Search for All' : 'Search for Any'}
            </Button>
            <Button
                style={{ margin: '0 1em' }}
                variant="contained" onClick={searchQuery}>
                Search
            </Button>
            {
                (queryResult !== null)
                    ? <AdminResultTable updateCallback={updateCallbackFn} queryResult={queryResult}></AdminResultTable>
                    : <></>
            }
        </Paper>
    );
}