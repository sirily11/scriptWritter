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
  Grid,
  LinearProgress,
  TextField,
} from "@material-ui/core";

type Props = {
  title?: string;
  description?: string;
  open: boolean;
  onClose(title?: string, description?: string): Promise<void>;
};

export function CreateOrEditScriptDialog(props: Props) {
  const [title, setTitle] = useState(props.title);
  const [desc, setDesc] = useState(props.description);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dialog open={props.open} fullWidth>
      <Collapse in={isLoading}>
        <LinearProgress />
      </Collapse>
      <DialogTitle>Script</DialogTitle>
      <DialogContent>
        <Grid>
          <TextField
            label="Title"
            fullWidth
            value={title}
            variant="filled"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid>
          <TextField
            style={{ marginTop: 10 }}
            label="Description"
            multiline
            rows={10}
            fullWidth
            value={desc}
            variant="filled"
            onChange={(e) => setDesc(e.target.value)}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={async () => props.onClose()}>Close</Button>
        <Button
          onClick={async () => {
            setIsLoading(true);
            await props.onClose(title, desc);
            setIsLoading(false);
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
