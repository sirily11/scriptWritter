import React, { Component } from "react";
import { Editor, Node } from "slate";
import { Content, SettingsDetail } from "./scriptWriterInterfaces";

interface State {
  value: Node[];
  selectedContent?: Content;

  onChange(value: Node[]): void;

  insertSettings(settings: SettingsDetail, editor: Editor): void;

  setSelectedContent(content?: Content, editor?: Editor): void;

  clear(editor?: Editor): void;
}

interface Props {}

//@ts-ignore
const context: State = {};

export const EditorContext = React.createContext(context);

export default class EditorProvider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ],
      onChange: this.onChange,
      insertSettings: this.insertSettings,
      setSelectedContent: this.setSelectedContent,
      clear: this.clear,
    };
  }

  onChange = (value: Node[]) => {
    this.setState({ value });
  };

  setSelectedContent = (content?: Content, editor?: Editor) => {
    if (content) {
      let value = content.content;
      this.setState({ value: value as any });
    } else {
      this.clear(editor);
    }
    this.setState({ selectedContent: content });
  };

  insertSettings = (settings: SettingsDetail, editor: Editor) => {
    const node: Node = {
      type: "settings",
      children: [{ text: "" }],
      data: { id: settings.id },
    };
    editor.insertNode(node);
    // value.push(node);
    // this.setState({ value });
  };

  clear = (editor?: Editor) => {
    if (editor) {
      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      };
    }
    this.setState({
      value: [{ type: "paragraph", children: [{ text: " " }] }],
    });
  };

  render() {
    return (
      <EditorContext.Provider value={this.state}>
        {this.props.children}
      </EditorContext.Provider>
    );
  }
}
