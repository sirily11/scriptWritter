// @flow
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import {
  AppBar,
  Backdrop,
  CircularProgress,
  createStyles,
  Drawer,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import MenuIcon from "@material-ui/icons/Menu";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import { Room } from "../models/scriptWriterInterfaces";
import firebase from "firebase";
import { ScriptContent } from "./ScriptContent";
import { LeftPart } from "./LeftPart";
import { EditorPanel } from "./editor/EditorPanel";
import { CreateOrEditScriptDialog } from "../home/CreateOrEditScriptDialog";
import { HomeContext } from "../models/HomeContext";

type TParams = { id?: string };
type Props = {};

const useStyle = makeStyles((theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    title: {
      flexGrow: 1,
    },
    drawer: {
      width: 300,
      flexShrink: 0,
    },
    appBar: {
      width: `calc(100% - 300px)`,
      marginLeft: 300,
      [theme.breakpoints.down("xs")]: {
        marginLeft: 0,
        width: "100%",
      },
    },
    container: {
      marginTop: 50,
      [theme.breakpoints.down("xs")]: {
        marginLeft: 0,
      },
      marginLeft: 300,
      height: "62vh",
      overflowY: "scroll",
    },
    iconContainer: {
      display: "flex",
      width: "100%",
    },
    centerIcon: {
      marginLeft: "auto",
      marginRight: "auto",
    },
    bottomEditorPanel: {
      [theme.breakpoints.down("xs")]: {
        marginLeft: 0,
      },
      marginLeft: 300,
    },
  })
);

export function RoomPage({ match }: RouteComponentProps<TParams>) {
  let id = match.params.id;
  const { editScript } = useContext(HomeContext);
  const [room, setRoom] = useState<Room>();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const classes = useStyle();
  useEffect(() => {
    firebase
      .firestore()
      .collection("scripts")
      .doc(id)
      .onSnapshot((doc) => {
        setRoom({ id: doc.id, ...(doc.data() as Room) });
      });
  }, [id]);

  return (
    <div style={{ overflowY: "hidden" }}>
      <Hidden xsDown>
        <Drawer variant="permanent">
          <LeftPart settings={room?.settings} id={room?.id} />
        </Drawer>
      </Hidden>

      <Hidden smUp>
        <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
          <NavLink to="/home">
            <IconButton>
              <ArrowBackIosIcon />
            </IconButton>
          </NavLink>
          <LeftPart settings={room?.settings} id={room?.id} />
        </Drawer>
      </Hidden>

      <AppBar className={classes.appBar} color="secondary">
        <Toolbar>
          <Hidden xsDown>
            <NavLink to="/home">
              <IconButton>
                <ArrowBackIosIcon />
              </IconButton>
            </NavLink>
          </Hidden>
          <Hidden smUp>
            <IconButton onClick={() => setOpenDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography variant="h6" className={classes.title}>
            {room?.title}
          </Typography>
          <IconButton
            onClick={async () => {
              setShowEditDialog(true);
            }}
          >
            <EditIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.container}>
        {room && <ScriptContent room={room} />}
      </div>
      {room && (
        <div className={classes.bottomEditorPanel}>
          <EditorPanel room={room} />{" "}
        </div>
      )}
      {room && showEditDialog && (
        <CreateOrEditScriptDialog
          open={showEditDialog}
          title={room?.title}
          description={room?.description}
          onClose={async (title, description) => {
            if (title && description && room) {
              await editScript(room.id ?? "", title, description);
            }
            setShowEditDialog(false);
          }}
        />
      )}
      <Backdrop className={classes.backdrop} open={room === undefined}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
