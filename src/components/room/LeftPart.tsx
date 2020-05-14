import {Settings, SettingsDetail}                                       from "../models/scriptWriterInterfaces";
import * as React                                                       from "react";
import {useContext, useState}                                           from "react";
import {HomeContext}                                                    from "../models/HomeContext";
import {IconButton, List, ListItem, ListItemText, Tooltip, Typography,} from "@material-ui/core";
import AddIcon                                                          from "@material-ui/icons/Add";
import {TreeItem, TreeView}                                             from "@material-ui/lab";
import ExpandMoreIcon                                                   from "@material-ui/icons/ExpandMore";
import ChevronRightIcon                                                 from "@material-ui/icons/ChevronRight";
import EditIcon                                                         from "@material-ui/icons/Edit";
import DeleteIcon                                                       from "@material-ui/icons/Delete";
import {CreateOrAddSettingsDialog}                                      from "./dialogs/CreateOrAddSettingsDialog";
import {CreateOrAddDetailsDialog}                                       from "./dialogs/CreateOrAddDetailsDialog";
import {makeStyles}                                                     from "@material-ui/core/styles";

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

export function LeftPart(props: { settings?: Settings[]; id?: string }) {
  const classes = useStyle();
  const {
    createSettings,
    deleteSettings,
    updateSettings,
    createDetails,
    deleteDetails,
    updateDetails,
  } = useContext(HomeContext);
  const [showAddSettings, setShowSettings] = useState(false);
  const [showAddDetails, setShowAddDetails] = useState(false);
  const [selectedSettings, setSelectedSettings] = useState<Settings>();
  const [selectedDetails, setSelectedDetails] = useState<SettingsDetail>();

  return (
    <List className={classes.drawer}>
      <ListItem>
        <ListItemText>
          <Typography variant="h5">
            Settings
            <Tooltip title={"Add Settings"}>
              <IconButton onClick={() => setShowSettings(true)}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Typography>
        </ListItemText>
      </ListItem>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {props.settings &&
          props.settings.map((s, i) => (
            <TreeItem
              key={`settings-${i}`}
              nodeId={`${i}`}
              label={
                <Typography style={{ fontSize: 18, fontWeight: "bold" }}>
                  {s.type}
                </Typography>
              }
            >
              {s.details.map((sd, i) => (
                <TreeItem
                  nodeId={`sd-${s.type}-${i}`}
                  key={`sd-${s.type}-${i}`}
                  endIcon={<EditIcon />}
                  onIconClick={() => {
                    setSelectedSettings(s);
                    setSelectedDetails(sd);
                    setShowAddDetails(true);
                  }}
                  label={
                    <div>
                      <Typography variant="h6">{sd.title}</Typography>
                      <Typography variant="caption">{sd.content}</Typography>
                    </div>
                  }
                />
              ))}

              <div className={classes.iconContainer}>
                <Tooltip title={"Edit settings"}>
                  <IconButton
                    className={classes.centerIcon}
                    onClick={() => {
                      setSelectedSettings(s);
                      setShowSettings(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={"Delete settings"}>
                  <IconButton
                    className={classes.centerIcon}
                    onClick={async () => {
                      if (props.id && props.settings) {
                        await deleteSettings(i, props.id, props.settings);
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={"Add details"}>
                  <IconButton
                    className={classes.centerIcon}
                    onClick={async () => {
                      setShowAddDetails(true);
                      setSelectedSettings(s);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </TreeItem>
          ))}
      </TreeView>
      {showAddSettings && (
        <CreateOrAddSettingsDialog
          open={showAddSettings}
          title={selectedSettings?.type}
          onClose={async (title) => {
            if (title && props.id && props.settings) {
              if (selectedSettings)
              {
                let index = props.settings.findIndex(
                    (s) => s.id === selectedSettings.id
                );
                if (index > -1)
                {
                  await updateSettings(index, props.id, title, props.settings);
                }
              } else {
                await createSettings(title, props.id, props.settings);
              }
            }
            setShowSettings(false);
            setSelectedSettings(undefined);
            setSelectedDetails(undefined);
          }}
        />
      )}
      {showAddDetails && (
        <CreateOrAddDetailsDialog
          open={showAddDetails}
          title={selectedDetails?.title}
          content={selectedDetails?.content}
          onDelete={async () => {
            if (
              selectedSettings &&
              selectedDetails &&
              props.id &&
              props.settings
            )
            {
              let index = props.settings.findIndex(
                  (s) => s.id === selectedSettings.id
              );
              let detailIndex = selectedSettings.details.findIndex(
                  (d) => d.id === selectedDetails.id
              );
              if (detailIndex > -1)
              {
                await deleteDetails(
                    index,
                    detailIndex,
                    props.id,
                    props.settings
                );
              }
            }

            setShowAddDetails(false);
            setSelectedSettings(undefined);
            setSelectedDetails(undefined);
          }}
          onClose={async (title, content) => {
            if (
              title &&
              content &&
              props.id &&
              props.settings &&
              selectedSettings
            )
            {
              let index = props.settings.findIndex(
                  (s) => s.id === selectedSettings.id
              );
              if (selectedDetails)
              {
                let detailIndex = selectedSettings.details.findIndex(
                    (d) => d.id === selectedDetails.id
                );
                if (detailIndex > -1)
                {
                  await updateDetails(
                      index,
                      detailIndex,
                      props.id,
                      title,
                      content,
                      props.settings
                  );
                }
              } else {
                await createDetails(
                  index,
                  props.id,
                  title,
                  content,
                  props.settings
                );
              }
            }
            setShowAddDetails(false);
            setSelectedSettings(undefined);
            setSelectedDetails(undefined);
          }}
        />
      )}
    </List>
  );
}
