import { useState } from 'react';
import DashBoard from './DashBoard'
import Banner from './Banner'
import Login from './Login';
import Admin from './Admin';
import { useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'

const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });


const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [auth, login] = useState(null);
    const [admin, setAdmin] = useState(false);
    const loggedin = (username, admin) => {
        login(username);
        setAdmin(admin);
    }

    const mainPage = () => {
        if (auth && admin) {
            return <Admin user={auth}></Admin>
        } else if (auth) {
            return <DashBoard user={auth}></DashBoard>;
        } else {
            return <Login authSuccessCallback={loggedin}></Login>;
        }
    }

    return (
        <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <div className="App" style={{ width: "100vw", height: "100vh", padding: '0', margin: '0' }}>
                <Banner></Banner>
                {
                    mainPage()
                }
            </div>
        </ThemeProvider>


    )
}

export default App
