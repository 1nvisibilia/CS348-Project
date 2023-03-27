import { useState } from 'react';
import DashBoard from './DashBoard'
import Banner from './Banner'
import Login from './Login';
import Admin from './Admin';
import './App.css'

function App() {
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
        <div className="App" style={{ width: "100vw", height: "100vh", padding: '0', margin: '0' }}>
            <Banner></Banner>
            {
                mainPage()
            }
        </div>
    )
}

export default App
