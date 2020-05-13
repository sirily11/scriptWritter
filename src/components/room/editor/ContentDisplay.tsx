// @flow
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { createEditor } from "slate";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { SettingsText } from "./SettingsText";
import { Room } from "../../models/scriptWriterInterfaces";

type Props = { value: any; room: Room };

export const withSettings = (editor: ReactEditor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === "settings" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "settings" ? true : isVoid(element);
  };

  return editor;
};

export function BlockRender(props: any) {
  // @ts-ignore
  const DefaultElement = (props) => {
    return <p {...props.attributes}>{props.children}</p>;
  };
  switch (props.element.type) {
    case "settings":
      return <SettingsText {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
}

export function ContentDisplay(props: Props) {
  const [value, setValue] = useState(props.value);
  const { room } = props;
  const editor = useMemo(() => withSettings(withReact(createEditor())), []);

  useEffect(() => {
    setValue(props.value);
  }, [room]);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(v) => {
        setValue(v);
      }}
    >
      <Editable
        readOnly={true}
        renderElement={(p) => {
          let np = { ...p, room: room };
          return <BlockRender {...np} />;
        }}
      />
    </Slate>
  );
}
