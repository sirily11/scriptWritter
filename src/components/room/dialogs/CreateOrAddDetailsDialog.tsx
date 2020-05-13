// @flow
import * as React from "react";
import { useState } from "react";
import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  TextField,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

type Props = {
  open: boolean;
  title?: string;
  content?: string;
  onClose(title?: string, content?: string): Promise<void>;
  onDelete(): Promise<void>;
};

export function CreateOrAddDetailsDialog(props: Props) {
  const [title, setTitle] = useState(props.title ?? "");
  const [content, setContent] = useState(props.content ?? "");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Dialog open={props.open} fullWidth>
      <Collapse in={isLoading}>
        <LinearProgress />
      </Collapse>
      <DialogTitle>
        Settings
        {props.title && (
          <IconButton
            onClick={async () => {
              setIsLoading(true);
              await props.onDelete();
              setIsLoading(false);
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Title"
          variant="filled"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          style={{ marginTop: 10 }}
          fullWidth
          label="Content"
          variant="filled"
          multiline={true}
          rows={3}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()}>Cancel</Button>
        <Button
          onClick={async () => {
            setIsLoading(true);
            await props.onClose(title, content);
            // setIsLoading(false);
          }}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
