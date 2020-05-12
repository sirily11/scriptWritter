// @flow
import * as React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Grid,
  Card,
  Tooltip,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { HomeContext } from "../models/HomeContext";
import { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { CreateOrEditScriptDialog } from "./CreateOrEditScriptDialog";

type Props = {};

const useStyle = makeStyles({
  container: {
    marginTop: 30,
  },
  card: {
    height: 250,
    display: "flex",
  },
  addIconContainer: {
    height: 50,
    width: "100%",
    display: "flex",
    marginTop: "auto",
    marginBottom: "auto",
  },
  addIcon: {
    marginLeft: "auto",
    marginRight: "auto",
  },
});

export function HomePage(props: Props) {
  const { user, signOut, createScript } = React.useContext(HomeContext);
  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyle();

  useEffect(() => {
    if (user === null) {
      window.location.href = "#";
    }
  }, [user]);

  return (
    <div>
      <AppBar color="secondary" position="static">
        <Toolbar>
          <IconButton
            onClick={async () => {
              await signOut();
            }}
          >
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container className={classes.container}>
        <Grid container>
          <Grid item xs={6} md={3} lg={2}>
            <Tooltip title={"Add New Script"}>
              <Card className={classes.card}>
                <div className={classes.addIconContainer}>
                  <IconButton
                    className={classes.addIcon}
                    onClick={() => setOpenDialog(true)}
                  >
                    <AddIcon />
                  </IconButton>
                </div>
              </Card>
            </Tooltip>
          </Grid>
        </Grid>
      </Container>
      <CreateOrEditScriptDialog
        open={openDialog}
        onClose={async (title, description) => {
          if (title && description) {
            await createScript(title, description);
          }
          setOpenDialog(false);
        }}
      />
    </div>
  );
}