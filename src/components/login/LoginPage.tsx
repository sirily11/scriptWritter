// @flow
import * as React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Container, Paper, Tabs, Tab, Box, Fade, TextField, Button, Grid, ButtonBase, Collapse} from '@material-ui/core';
import googleLogo from './google_sign.png'
import * as firebase from "firebase"
import {useContext} from "react";
import {HomeContext} from "../models/HomeContext";

type Props = {};

const useStyles = makeStyles(theme => ({
    root: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    card: {
        padding: "20px",
        marginLeft: "auto",
        marginRight: "auto",
        width: "500px"
    },
    inputField: {
        marginBottom: 20
    },
    loginButton: {
        float: "right"
    },
    googleButton: {
        marginLeft: "auto",
        marginRight: "auto"
    }
}),);

function LoginCard() {
    const classes = useStyles();
    const {login} = useContext(HomeContext)
    const [email, setEmail] = React.useState<string>()
    const [password, setPassword] = React.useState<string>()

    return <Box m={2}>
        <TextField
            className={classes.inputField}
            fullWidth
            label="Email Address"
            variant="filled"
            type={"email"}
            onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
            className={classes.inputField}
            fullWidth
            label="Password"
            variant="filled"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
        />
        <Button className={classes.loginButton} onClick={async () => {
            if (email && password) {
              await login(email, password);
            }
        }}>
            Login
        </Button>
        <Grid container justify={'center'}>
            <Grid item>
                <ButtonBase onClick={async () => {
                    let provider = new firebase.auth.GoogleAuthProvider();
                    let result = await firebase.auth().signInWithPopup(provider)

                }}>
                    <img alt={"Google Sign In"} src={googleLogo} height={40}/>
                </ButtonBase>
            </Grid>
        </Grid>
    </Box>;
}

function SignUpCard() {
    const classes = useStyles();
    const {signUp} = useContext(HomeContext)
    const [email, setEmail] = React.useState<string>()
    const [password, setPassword] = React.useState<string>()
    return <Box m={2}>
        <TextField
            className={classes.inputField}
            fullWidth
            label="Email Address"
            variant="filled"
            type={"email"}
            onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
            className={classes.inputField}
            fullWidth
            label="Password"
            variant="filled"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
        />
        <Button className={classes.loginButton} onClick={async () => {
            if (email && password) {
                await signUp(email, password);
            }
        }}>
            Sign Up
        </Button>
    </Box>;
}

export function LoginPage(props: Props) {
    const classes = useStyles();
    const [currentIndex, setCurrentIndex] = React.useState(0);
    return (
        <div className={classes.root}>
            <Container>
                <Paper className={classes.card}>
                    <Tabs value={currentIndex} onChange={(e, newValue) => setCurrentIndex(newValue)}>
                        <Tab label={"Login"}/>
                        <Tab label={"Sign Up"}/>
                    </Tabs>
                    <Collapse in={currentIndex === 0} mountOnEnter unmountOnExit>
                        {LoginCard()}
                    </Collapse>
                    <Collapse in={currentIndex === 1} mountOnEnter unmountOnExit>
                        {SignUpCard()}
                    </Collapse>
                </Paper>
            </Container>
        </div>
    );
}