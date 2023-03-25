import React, { useState } from 'react'
import { Grid, Paper, Avatar, TextField, Button, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { red } from '@mui/material/colors';

const Login = ({authSuccessCallback}) => {
    const paperStyle = { padding: 20, height: '70vh', width: 280, margin: "20px auto" };
    const avatarStyle = { backgroundColor: '#1bbd7e' };
    const btnstyle = { margin: '8px 0' };
    const [userName, setUserName] = useState("");
    const [userpw, setUserpw] = useState("");
    const [loginFailed, setFailed] = useState(false);

    const authenticate = async () => {
        console.log(userName, userpw);
        const response = await axios.get('/login', {
            params: {
                userName,
                userpw
            }
        })

        if (response.data) {
            // authed
            setFailed(false);
            authSuccessCallback(userName);
        } else {
            // error
            setFailed(true);
        }
    }

    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                    <h2>Sign In</h2>
                </Grid>
                <TextField onChange={(event) => setUserName(event.target.value)} value={userName}
                    style={{ margin: '2em 0' }} label='Student ID #' placeholder='Enter username' variant="outlined" fullWidth required />
                <TextField onChange={(event) => setUserpw(event.target.value)} value={userpw}
                    style={{ margin: '0 0 2em' }} label='Password' placeholder='Enter password' type='password' variant="outlined" fullWidth required />
                <Button onClick={authenticate} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Sign in</Button>
                {
                    loginFailed
                        ? <Typography color={red[500]}>Username or password is incorrect</Typography>
                        : <></>
                }
            </Paper>
        </Grid>
    )
}

export default Login