// @flow
import * as React                                                      from "react";
import {useContext}                                                    from "react";
import {Room}                                                          from "../models/scriptWriterInterfaces";
import {Card, CardActions, CardContent, IconButton, List, Typography,} from "@material-ui/core";
import DeleteIcon                                                      from "@material-ui/icons/Delete";
import EditIcon                                                        from "@material-ui/icons/Edit";
import {makeStyles}                                                    from "@material-ui/core/styles";
import {ContentDisplay}                                                from "./editor/ContentDisplay";
import {HomeContext}                                                   from "../models/HomeContext";
import {EditorContext}                                                 from "../models/EditorContext";

const useStyles = makeStyles({
  card: {
    margin: 10,
  },
  list: {
    overflowY: "scroll",
  },
});

type Props = {
  room: Room;
};

export function ScriptContent(props: Props)
{
  const {deletePost} = useContext(HomeContext);
  const {selectedContent, setSelectedContent} = useContext(EditorContext);

  const classes = useStyles();
  return (
      <List className={classes.list}>
        {props.room.content.map((c, i) => (
            <Card
                className={classes.card}
                key={`content-${i}`}
                raised={selectedContent !== undefined}
            >
              <CardContent>
                <ContentDisplay value={c.content} room={props.room}/>
                <Typography variant="body2" color="textSecondary">
                  Author: {c.user.username}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                    onClick={async () =>
                    {
                      if (props.room)
                      {
                        await deletePost(props.room.id ?? "", c);
                      }
                    }}
                >
                  <DeleteIcon/>
                </IconButton>
                <IconButton
                    onClick={async () =>
                    {
                      if (props.room)
                      {
                        await setSelectedContent(c);
                      }
                    }}
                >
                  <EditIcon/>
                </IconButton>
              </CardActions>
            </Card>
        ))}
      </List>
  );
}
