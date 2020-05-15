// @flow
import * as React                 from "react";
import {useEffect, useState}      from "react";
import {
    AppBar,
    Backdrop,
    Card,
    CardActionArea,
    CircularProgress,
    Container,
    createStyles,
    Grid,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
}                                 from "@material-ui/core";
import ExitToAppIcon              from "@material-ui/icons/ExitToApp";
import {HomeContext}              from "../models/HomeContext";
import AddIcon                    from "@material-ui/icons/Add";
import {makeStyles}               from "@material-ui/core/styles";
import {CreateOrEditScriptDialog} from "./CreateOrEditScriptDialog";

type Props = {};

const useStyle = makeStyles((theme) =>
    createStyles({
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
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: "#fff",
        },
    })
);

export function HomePage(props: Props)
{
    const {user, signOut, createScript, room, isLoading} = React.useContext(
        HomeContext
    );
    const [openDialog, setOpenDialog] = useState(false);
    const classes = useStyle();

    useEffect(() =>
    {
        if (user === null)
        {
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
        <Grid container spacing={5}>
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
          {room.map((r, i) => (
            <Grid key={`room-${i}`} item xs={6} md={3} lg={2}>
              <Card className={classes.card}>
                <CardActionArea
                  onClick={() => {
                    window.location.href = "#room/" + r.id;
                  }}
                >
                  <div className={classes.addIconContainer}>
                    <div className={classes.addIcon}>
                      <Typography variant="h5">{r.title}</Typography>
                      <Typography noWrap style={{ maxWidth: 150 }}>
                          {r.description}
                      </Typography>
                    </div>
                  </div>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
        <Backdrop className={classes.backdrop} open={isLoading}>
            <CircularProgress color="inherit"/>
        </Backdrop>
        <CreateOrEditScriptDialog
            open={openDialog}
            onClose={async (title, description) =>
            {
                if (title && description)
                {
                    await createScript(title, description);
                }
                setOpenDialog(false);
            }}
        />
    </div>
  );
}
