// @flow
import * as React                                        from "react";
import {useContext, useEffect, useState}                 from "react";
import {RouteComponentProps}                             from "react-router-dom";
import {Backdrop, CircularProgress, createStyles, Fade,} from "@material-ui/core";
import {makeStyles}                                      from "@material-ui/core/styles";
import {Room, ScriptUser}                                from "../models/scriptWriterInterfaces";
import firebase                                          from "firebase";
import {HomeContext}                                     from "../models/HomeContext";
import {RoomContent}                                     from "./RoomContent";

type TParams = { id?: string };
type Props = {};

const useStyle = makeStyles((theme) =>
    createStyles({
      backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
      },
    })
);

interface Callback
{
  (room: Room): void;
}

// call this function when first open the page
const init = async (
    room: Room[],
    id: string | undefined,
    doc: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>,
    cb: Callback
) =>
{
  let user: ScriptUser = {
    userID: firebase.auth().currentUser?.uid ?? "",
    username: firebase.auth().currentUser?.displayName ?? "",
  };
  let foundRoom = room.find((r) => r.id === id);
  if (foundRoom)
  {
    let foundUser = foundRoom.currentUsers.find(
        (u) => u.userID === user.userID
    );
    if (!foundUser)
    {
      await doc.update({
        currentUsers: firebase.firestore.FieldValue.arrayUnion(user),
      });
    }
    doc.onSnapshot((d) =>
    {
      // @ts-ignore
      let room: Room = {id: d.id, ...d.data()};
      cb(room);
    });
  }
};

export function RoomPage({match}: RouteComponentProps<TParams>)
{
  let id = match.params.id;
  const {user, room} = useContext(HomeContext);
  const [singleRoom, setSingleRoom] = useState<Room>();
  const classes = useStyle();

  useEffect(() =>
  {
    let doc = firebase.firestore().collection("scripts").doc(id);
    // add user to the room
    if (user && room.length > 0)
    {
      init(room, id, doc, (room1) => setSingleRoom(room1)).then(() =>
          console.log("Update current user")
      );
    }
  }, [user, room]);

  return (
      <div>
        {singleRoom && (
            <Fade in={true}>
              <RoomContent room={singleRoom}/>
            </Fade>
        )}
        <Backdrop className={classes.backdrop} open={singleRoom === undefined}>
          <CircularProgress color="inherit"/>
        </Backdrop>
      </div>
  );
}
