import React, { useState } from 'react'
import { Grid, Paper, Avatar, TextField, Button, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { red } from '@mui/material/colors';

const Login = ({ authSuccessCallback }) => {
    const paperStyle = { padding: 20, height: '70vh', width: 280, margin: "20px auto" };
    const avatarStyle = { backgroundColor: '#1bbd7e' };
    const btnstyle = { margin: '8px 0' };
    const [userName, setUserName] = useState("");
    const [userpw, setUserpw] = useState("");
    const [loginFailed, setFailed] = useState(false);
    const [loginLock, setLock] = useState(false);
    const [failCounter, setCounter] = useState(4)

    const timer = setTimeout(() => {
        setLock(false)
        setFailed(false)
        setCounter(4)
    }, 60000)

    const authenticate = async () => {
        const response = await axios.get('/login', {
            params: {
                userName,
                userpw
            }
        })
        console.log(response.data);
        if (response.data.auth) {
            // authed
            setFailed(false);
            authSuccessCallback(userName, response.data.admin);
        } else {
            // error
            setCounter(failCounter - 1)
            if (failCounter === 1) {
                setLock(true)
                timer()
                return
            }
            setFailed(true);
        }
    }

    return (
        <Grid>
            <main>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                        <h1>Sign In</h1>
                    </Grid>
                    <TextField role="form" onChange={(event) => setUserName(event.target.value)} value={userName} disabled={loginLock}
                        style={{ margin: '2em 0' }} label='Student ID #' placeholder='Enter username' variant="outlined" fullWidth required />
                    <TextField role="form" onChange={(event) => setUserpw(event.target.value)} value={userpw} disabled={loginLock}
                        style={{ margin: '0 0 2em' }} label='Password' placeholder='Enter password' type='password' variant="outlined" fullWidth required />
                    <Button onClick={authenticate} type='submit' color='primary' variant="contained" style={btnstyle} disabled={loginLock} fullWidth>Sign in</Button>
                    {
                        loginLock ? <Typography color={red[500]}>Too many failed attempts, please try again in 60 seconds</Typography>
                        : loginFailed ? <Typography color={red[500]}>Username or password is incorrect, {failCounter} attempts remaining</Typography>
                        : <></>
                    }
                </Paper>
            </main>
        </Grid>
    )
}

export default Login