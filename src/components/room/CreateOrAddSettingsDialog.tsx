// @flow
import * as React from "react";
import {useState} from "react";
import {
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    TextField,
}                 from "@material-ui/core";

type Props = {
    open: boolean;
    title?: string;
    onClose(title?: string): Promise<void>;
};

export function CreateOrAddSettingsDialog(props: Props)
{
    const [title, setTitle] = useState(props.title ?? "");
    const [isLoading, setIsLoading] = useState(false);
    return (
        <Dialog open={props.open} fullWidth>
            <Collapse in={isLoading}>
                <LinearProgress/>
            </Collapse>
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Settings Type"
                    variant="filled"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose()}>Cancel</Button>
                <Button
                    onClick={async () =>
                    {
                        setIsLoading(true);
                        await props.onClose(title);
                        // setIsLoading(false);
                    }}
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}
