// @flow
import * as React from "react";
import { useContext, useMemo, useState } from "react";
import {
  Button,
  Chip,
  Collapse,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from "@material-ui/core";
import { Room } from "../../models/scriptWriterInterfaces";
import { makeStyles } from "@material-ui/core/styles";
import { EditorContext } from "../../models/EditorContext";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { HomeContext } from "../../models/HomeContext";
import { BlockRender, withSettings } from "./ContentDisplay";

type Props = { room: Room };

const useStyle = makeStyles({
  editor: {
    margin: 20,
    padding: 20,
  },
  mainEditor: {
    borderBottom: "2px solid white",
    height: 150,
    overflowY: "scroll",
    width: "100%",
  },
  chipContainer: {
    maxHeight: 190,
    overflowY: "scroll",
  },
  divider: {
    marginBottom: 10,
    marginTop: 10,
    width: "100%",
  },
  chip: {
    marginRight: 10,
    marginBottom: 10,
  },
});

export function EditorPanel(props: Props) {
  const classes = useStyle();
  const { room } = props;
  const [isLoading, setIsLoading] = useState(false);
  const editor = useMemo(() => withSettings(withReact(createEditor())), []);
  const {
    value,
    onChange,
    insertSettings,
    clear,
    setSelectedContent,
    selectedContent,
  } = useContext(EditorContext);
  const { post, editPost } = useContext(HomeContext);
  // @ts-ignore
  const DefaultElement = (props) => {
    return <p {...props.attributes}>{props.children}</p>;
  };

  return (
    <Paper className={classes.editor}>
      <Collapse in={isLoading} mountOnEnter unmountOnExit>
        <LinearProgress />
      </Collapse>
      <Grid container>
        <Grid item xs={4} className={classes.chipContainer}>
          {props.room.settings.map((s, i) => (
            <div key={`sc-${i}`}>
              <Typography>{s.type}</Typography>
              {s.details.map((sd, i) => (
                <Chip
                  clickable
                  onClick={() => {
                    insertSettings(sd, editor);
                  }}
                  key={`sd-${i}`}
                  className={classes.chip}
                  label={sd.title}
                />
              ))}
            </div>
          ))}
        </Grid>
        <Grid item xs={8}>
          <Slate
            editor={editor}
            value={value}
            onChange={(v) => {
              onChange(v);
            }}
          >
            <Editable
              className={classes.mainEditor}
              renderElement={(p) => {
                let np = { ...p, room: room };
                return <BlockRender {...np} />;
              }}
            />
          </Slate>
          <Grid
            container
            alignItems="flex-start"
            justify="flex-end"
            direction="row"
            style={{ marginTop: 10 }}
          >
            <Collapse
              in={selectedContent !== undefined}
              mountOnEnter
              unmountOnExit
              style={{ marginRight: 10 }}
            >
              <Button
                variant="contained"
                onClick={async () => {
                  setSelectedContent(undefined);
                }}
              >
                Cancel
              </Button>
            </Collapse>
            <Button
              variant="contained"
              onClick={async () => {
                setIsLoading(true);
                if (props.room.id) {
                  if (selectedContent) {
                    await editPost(
                      props.room.id,
                      selectedContent.id,
                      value,
                      props.room.content
                    );
                    setSelectedContent(undefined);
                  } else {
                    await post(props.room.id, value);
                  }
                }
                await clear(editor);
                setIsLoading(false);
              }}
            >
              {selectedContent ? "Update" : "Post"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
