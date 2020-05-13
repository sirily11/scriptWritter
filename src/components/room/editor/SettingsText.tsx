// @flow
import * as React from "react";
import { Node } from "slate";
import { Room, SettingsDetail } from "../../models/scriptWriterInterfaces";
import { Tooltip } from "@material-ui/core";

type Props = { element: Node; attributes: any; children: any; room: Room };

export function SettingsText(props: Props) {
  const { element, attributes, children } = props;
  const data = (element.data as any).id as string;
  let settings: SettingsDetail | undefined;
  props.room.settings.forEach((s) => {
    s.details.forEach((d) => {
      if (d.id === data) {
        settings = d;
      }
    });
  });

  return (
    <Tooltip title={`Content: ${settings?.content ?? "Deleted"}`}>
      <span
        {...attributes}
        contentEditable={false}
        style={{
          display: "inline-block",
          color: "yellow",
          marginLeft: 3,
          marginRight: 3,
        }}
      >
        {settings?.title ?? "Deleted"}
        {children}
      </span>
    </Tooltip>
  );
}
