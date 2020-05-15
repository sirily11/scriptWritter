// @flow
import * as React                        from "react";
import {useContext, useEffect, useState} from "react";
import {NavLink}                         from "react-router-dom";
import {
    AppBar,
    Avatar,
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
import {Room}                            from "../models/scriptWriterInterfaces";
import firebase                          from "firebase";
import {ScriptContent}                   from "./ScriptContent";
import {LeftPart}                        from "./LeftPart";
import {EditorPanel}                     from "./editor/EditorPanel";
import {CreateOrEditScriptDialog}        from "../home/CreateOrEditScriptDialog";
import {HomeContext}                     from "../models/HomeContext";
import {SnackBars}                       from "./SnackBars";
import {AvatarGroup}                     from "@material-ui/lab";

type TParams = { id?: string };
type Props = {
    room: Room;
};

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

const clearText = async (room: Room) =>
{
    // remove user
    let currentUser = firebase.auth().currentUser?.uid;
    let doc = firebase.firestore().collection("scripts").doc(room.id);

    let index = room.currentUsers.findIndex((c) => c.userID === currentUser);
    room.currentUsers.splice(index, 1);
    await doc.update({
        currentUsers: room.currentUsers,
    });
};

export function RoomContent(props: Props)
{
    const {editScript, user, refreshRoom} = useContext(HomeContext);
    const {room} = props;
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const classes = useStyle();

    useEffect(() =>
    {
        window.addEventListener("beforeunload", (e) =>
        {
            clearText(room);
        });
    }, []);

    return (
        <div style={{overflowY: "hidden"}}>
            <Hidden xsDown>
                <Drawer variant="permanent">
                    <LeftPart settings={room?.settings} id={room?.id}/>
                </Drawer>
            </Hidden>
            <Hidden smUp>
                <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
                    <NavLink to="/home">
                        <IconButton
                            onClick={async () =>
                            {
                                await clearText(room);
                                await refreshRoom();
                            }}
                        >
                            <ArrowBackIosIcon/>
                        </IconButton>
                    </NavLink>
                    <LeftPart settings={room?.settings} id={room?.id}/>
                </Drawer>
            </Hidden>

            <AppBar className={classes.appBar} color="secondary">
                <Toolbar>
                    <Hidden xsDown>
                        <NavLink to="/home">
                            <IconButton
                                onClick={async () =>
                                {
                                    await clearText(room);
                                    await refreshRoom();
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
                        {room?.title}
                    </Typography>

                    <AvatarGroup max={4}>
                        {room?.currentUsers?.map((c) => (
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
                {room && <ScriptContent room={room}/>}
            </div>
            {room && (
                <div className={classes.bottomEditorPanel}>
                    <EditorPanel room={room}/>{" "}
                </div>
            )}
            {room && showEditDialog && (
                <CreateOrEditScriptDialog
                    open={showEditDialog}
                    title={room?.title}
                    description={room?.description}
                    onClose={async (title, description) =>
                    {
                        if (title && description && room)
                        {
                            await editScript(room.id ?? "", title, description);
                        }
                        setShowEditDialog(false);
                    }}
                />
            )}
            {room && <SnackBars room={room}/>}
        </div>
    );
}
