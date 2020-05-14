// @flow
import * as React                        from "react";
import {useContext, useEffect, useState} from "react";
import {NavLink, RouteComponentProps}    from "react-router-dom";
import {
    AppBar,
    Avatar,
    Backdrop,
    CircularProgress,
    createStyles,
    Drawer,
    Hidden,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
}                                        from "@material-ui/core";
import ArrowBackIosIcon                  from "@material-ui/icons/ArrowBackIos";
import MenuIcon                          from "@material-ui/icons/Menu";
import EditIcon                          from "@material-ui/icons/Edit";
import {makeStyles}                      from "@material-ui/core/styles";
import {Room, ScriptUser}                from "../models/scriptWriterInterfaces";
import firebase                          from "firebase";
import {ScriptContent}                   from "./ScriptContent";
import {LeftPart}                        from "./LeftPart";
import {EditorPanel}                     from "./editor/EditorPanel";
import {CreateOrEditScriptDialog}        from "../home/CreateOrEditScriptDialog";
import {HomeContext}                     from "../models/HomeContext";
import {SnackBars}                       from "./SnackBars";
import {AvatarGroup}                     from "@material-ui/lab";

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

const clearText = (room: Room[], id: string) =>
{
    let dataList = room.filter((r) => r.id === id);
    // remove user
    if (dataList.length > 0)
    {
        let r = dataList[0];
        let currentUser = firebase.auth().currentUser?.uid;
        let doc = firebase.firestore().collection("scripts").doc(r.id);

        let index = r.currentUsers.findIndex((c) => c.userID === currentUser);
        r.currentUsers.splice(index, 1);
        doc
            .update({
                currentUsers: r.currentUsers,
            })
            .then(() => console.log("remove"));
    }
};

export function RoomPage({match}: RouteComponentProps<TParams>)
{
    let id = match.params.id;
    const {editScript, user, room} = useContext(HomeContext);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [singleRoom, setSingleRoom] = useState<Room>();
    const [openDrawer, setOpenDrawer] = useState(false);
    const classes = useStyle();

    useEffect(() =>
    {
        let doc = firebase.firestore().collection("scripts").doc(id);
        // add user to the room
        if (firebase.auth().currentUser && room)
        {
            let user: ScriptUser = {
                userID: firebase.auth().currentUser?.uid ?? "",
                username: firebase.auth().currentUser?.displayName ?? "",
            };
            let dataList = room.filter((r) => r.id === id);
            if (dataList.length > 0)
            {
                let data = dataList[0];
                setSingleRoom(data);
                let foundUsers = data.currentUsers.filter(
                    (c) => c.userID === user.userID
                );
                if (foundUsers.length === 0)
                {
                    console.log("Add user");
                    doc.update({
                        currentUsers: firebase.firestore.FieldValue.arrayUnion(user),
                    });
                }
            }
        }
    }, [user, room]);

    useEffect(() =>
    {
        window.addEventListener("beforeunload", (e) =>
        {
            if (id)
            {
                clearText(room, id);
            }
        });
    }, []);

    return (
        <div style={{overflowY: "hidden"}}>
            <Hidden xsDown>
                <Drawer variant="permanent">
                    <LeftPart settings={singleRoom?.settings} id={singleRoom?.id}/>
                </Drawer>
            </Hidden>
            <Hidden smUp>
                <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
                    <NavLink to="/home">
                        <IconButton
                            onClick={() =>
                            {
                                if (id)
                                {
                                    clearText(room, id);
                                }
                            }}
                        >
                            <ArrowBackIosIcon/>
                        </IconButton>
                    </NavLink>
                    <LeftPart settings={singleRoom?.settings} id={singleRoom?.id}/>
        </Drawer>
      </Hidden>

      <AppBar className={classes.appBar} color="secondary">
        <Toolbar>
          <Hidden xsDown>
              <NavLink to="/home">
                  <IconButton
                      onClick={() =>
                      {
                          if (id)
                          {
                              clearText(room, id);
                          }
                      }}
                  >
                      <ArrowBackIosIcon/>
                  </IconButton>
              </NavLink>
          </Hidden>
            <Hidden smUp>
                <IconButton onClick={() => setOpenDrawer(true)}>
                    <MenuIcon/>
                </IconButton>
            </Hidden>
            <Typography variant="h6" className={classes.title}>
                {singleRoom?.title}
            </Typography>

            <AvatarGroup max={4}>
                {singleRoom?.currentUsers?.map((c) => (
                    <Tooltip title={c.username} key={`avatar-${c.userID}`}>
                        <Avatar style={{backgroundColor: "#c7f4ff", cursor: "grab"}}>
                            {c.username.charAt(0)}
                        </Avatar>
                    </Tooltip>
                ))}
            </AvatarGroup>

            <IconButton
                onClick={async () =>
                {
                    setShowEditDialog(true);
                }}
            >
                <EditIcon/>
            </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.container}>
          {singleRoom && <ScriptContent room={singleRoom}/>}
      </div>
            {singleRoom && (
                <div className={classes.bottomEditorPanel}>
                    <EditorPanel room={singleRoom}/>{" "}
                </div>
            )}
            {singleRoom && showEditDialog && (
                <CreateOrEditScriptDialog
                    open={showEditDialog}
                    title={singleRoom?.title}
                    description={singleRoom?.description}
                    onClose={async (title, description) =>
                    {
                        if (title && description && singleRoom)
                        {
                            await editScript(singleRoom.id ?? "", title, description);
                        }
                        setShowEditDialog(false);
                    }}
                />
            )}
            {singleRoom && <SnackBars room={singleRoom}/>}
            <Backdrop className={classes.backdrop} open={singleRoom === undefined}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        </div>
  );
}
