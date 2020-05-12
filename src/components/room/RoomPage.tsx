// @flow
import * as React                                 from "react";
import {useEffect, useState}                      from "react";
import {NavLink, RouteComponentProps}             from "react-router-dom";
import {Drawer, IconButton, Toolbar, Typography,} from "@material-ui/core";
import ArrowBackIosIcon                           from "@material-ui/icons/ArrowBackIos";
import EditIcon                                   from "@material-ui/icons/Edit";
import {makeStyles}                               from "@material-ui/core/styles";
import {Room,}                                    from "../models/scriptWriterInterfaces";
import firebase                                   from "firebase";
import {ScriptContent}                            from "./ScriptContent";
import {LeftPart}                                 from "./LeftPart";

type TParams = { id?: string };
type Props = {};

const useStyle = makeStyles({
  title: {
    flexGrow: 1,
  },
  drawer: {
    width: 300,
    flexShrink: 0,
  },
  container: {
    marginLeft: 300,
    padding: 0,
  },
  iconContainer: {
    display: "flex",
    width: "100%",
  },
  centerIcon: {
    marginLeft: "auto",
    marginRight: "auto",
  },
});

export function RoomPage({match}: RouteComponentProps<TParams>)
{
  let id = match.params.id;
  const [room, setRoom] = useState<Room>();
  const classes = useStyle();
  useEffect(() =>
  {
    firebase
        .firestore()
        .collection("scripts")
        .doc(id)
        .onSnapshot((doc) =>
        {
          setRoom({id: doc.id, ...(doc.data() as Room)});
        });
  }, []);

  return (
      <div>
        <Drawer variant="permanent">
          <LeftPart settings={room?.settings} id={room?.id}/>
        </Drawer>
        <div className={classes.container}>
          <Toolbar>
            <NavLink to="/home">
              <IconButton>
                <ArrowBackIosIcon/>
              </IconButton>
            </NavLink>
            <Typography variant="h6" className={classes.title}>
              News
            </Typography>
            <IconButton>
              <EditIcon/>
            </IconButton>
          </Toolbar>
          <ScriptContent/>
        </div>
      </div>
  );
}
