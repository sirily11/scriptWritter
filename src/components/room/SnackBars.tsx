// @flow
import * as React            from "react";
import {useEffect, useState} from "react";
import {Room, ScriptUser}    from "../models/scriptWriterInterfaces";
import firebase              from "firebase";
import {Snackbar}            from "@material-ui/core";

type Props = {
  room: Room;
};

export function SnackBars(props: Props)
{
  const {currentUsers} = props.room;
  const [typingUser, setTypingUser] = useState<ScriptUser>();

  useEffect(() =>
  {
    const currentUser = firebase.auth().currentUser?.uid;
    const users = currentUsers.filter(
        (c) => c.currentTyping && c.userID !== currentUser
    );
    if (users.length > 0)
    {
      setTypingUser(users[0]);
    } else
    {
      setTypingUser(undefined);
    }
  }, [currentUsers]);

  return (
      <Snackbar
          anchorOrigin={{vertical: "bottom", horizontal: "left"}}
          open={Boolean(typingUser)}
          message={`${typingUser?.username}: ${typingUser?.currentTyping}`}
      />
  );
}
