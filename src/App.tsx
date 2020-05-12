import React from 'react';

import './App.css';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {LoginPage} from "./components/login/LoginPage";
import {createMuiTheme, CssBaseline, ThemeProvider} from "@material-ui/core";
import {blue, grey} from "@material-ui/core/colors";
import HomeProvider from "./components/models/HomeContext";
import {HomePage} from "./components/home/HomePage";

const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: blue,
        secondary: grey
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <HomeProvider>
                <Router>
                    <Switch>
                        <Route path="/" exact>
                            <LoginPage/>
                        </Route>
                        <Route path="/home" exact>
                            <HomePage/>
                        </Route>
                    </Switch>
                </Router>
            </HomeProvider>
        </ThemeProvider>
    );
}

export default App;
