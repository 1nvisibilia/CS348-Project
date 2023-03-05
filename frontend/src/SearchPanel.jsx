import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
import ResultTable from './ResultTable';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const courseSubs = [
    'Any', 'CS', 'ECE', 'MATH', 'AMATH', 'PMATH', 'SE', 'STAT', 'CO', 'A', 'B', 'Bf', '3B', 'D1', '34B'
];

export default function SearchPanel() {
    const [courseSub, setCourseSub] = useState('Any');
    const [courseCode, setCourseCode] = useState('');
    const [numberValidity, setValid] = useState(true);
    const [queryResult, setResult] = useState(null);

    const checkNumberValidity = (courseNum) => {
        setValid(courseNum === '' || (0 < courseNum && courseNum < 1000))
    }

    const searchQuery = async () => {
        const response = await axios.get('/search', {
            params: {
                courseSub,
                courseCode
            }
        });
        console.log(response);
        setResult(response.data);
    };

    return (
        <div style={{ margin: '0 12em' }}>
            <FormControl fullWidth variant="standard"
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <InputLabel id="demo-simple-select-standard-label">Course Name</InputLabel>
                <Select sx={{ maxWidth: 100 }}
                    id="demo-simple-select"
                    value={courseSub}
                    label="Age"
                    onChange={(event) => setCourseSub(event.target.value)}
                    displayEmpty
                    MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                >
                    {
                        courseSubs.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)
                    }
                </Select>

                <TextField
                    id="standard-basic" label="Course Code" variant="standard"
                    placeholder="Any"
                    style={{ marginLeft: '4em', width: '100px' }}
                    type='number' error={!numberValidity}
                    onChange={(event) => checkNumberValidity(event.target.value) && setCourseCode(event.target.value)}
                />

                <Button
                    style={{ marginLeft: '4em' }}
                    variant="contained" onClick={searchQuery}>Search</Button>

            </FormControl>
            {
                (queryResult && (typeof queryResult === 'object'))
                    ? <ResultTable queryResult={queryResult}></ResultTable> : <></>
            }
        </div>
    );
}
