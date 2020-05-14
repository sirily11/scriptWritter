// @flow
import * as React                     from "react";
import {useEffect, useMemo, useState} from "react";
import {createEditor}                 from "slate";
import {Editable, Slate, withReact}   from "slate-react";
import {SettingsText}                 from "./SettingsText";
import {Room}                         from "../../models/scriptWriterInterfaces";
import {withSettings}                 from "./plugins/withSettings";

type Props = { value: any; room: Room };

// @ts-ignore
const DefaultElement = (props) =>
{
  return <p {...props.attributes}>{props.children}</p>;
};

export function BlockRender(props: any)
{
  const {attributes, children, element} = props;
  switch (element.type)
  {
    case "settings":
      return <SettingsText {...props} />;
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;
    case "heading-four":
      return <h4 {...attributes}>{children}</h4>;
    case "heading-five":
      return <h5 {...attributes}>{children}</h5>;
    case "heading-six":
      return <h6 {...attributes}>{children}</h6>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    default:
      return <DefaultElement {...props} />;
  }
}

export function ContentDisplay(props: Props)
{
  const [value, setValue] = useState(props.value);
  const {room} = props;
  const editor = useMemo(() => withSettings(withReact(createEditor())), []);

  useEffect(() =>
  {
    setValue(props.value);
  }, [room]);

  // useEffect(() => {

  // }, []);

  return (
      <Slate
          editor={editor}
          value={value}
          onChange={(v) =>
          {
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
