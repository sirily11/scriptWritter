import React                                        from "react";

import "./App.css";
import {HashRouter as Router, Route, Switch}        from "react-router-dom";
import {LoginPage}                                  from "./components/login/LoginPage";
import {createMuiTheme, CssBaseline, ThemeProvider} from "@material-ui/core";
import {blue, grey}                                 from "@material-ui/core/colors";
import HomeProvider                                 from "./components/models/HomeContext";
import {HomePage}                                   from "./components/home/HomePage";
import {RoomPage}                                   from "./components/room/RoomPage";
import EditorProvider                               from "./components/models/EditorContext";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: blue,
    secondary: grey,
  },
});

function App()
{
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <EditorProvider>
          <HomeProvider>
            <Router>
              <Switch>
                <Route path="/" exact>
                  <LoginPage/>
                </Route>
                <Route path="/home" exact>
                  <HomePage/>
                </Route>
                <Route path="/room/:id" exact component={RoomPage}/>
              </Switch>
            </Router>
          </HomeProvider>
        </EditorProvider>
      </ThemeProvider>
  );
}

export default App;
