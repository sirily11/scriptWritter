import React, {Component}                    from "react";
import {Editor, Node}                        from "slate";
import AwesomeDebouncePromise                from "awesome-debounce-promise";
import {Content, ScriptUser, SettingsDetail} from "./scriptWriterInterfaces";
import firebase                              from "firebase";

interface State
{
  value: Node[];
  selectedContent?: Content;

  onChange(value: Node[], docsId: string, currentUsers: ScriptUser[]): void;

  insertSettings(settings: SettingsDetail, editor: Editor): void;

  setSelectedContent(content?: Content, editor?: Editor): void;

  onSendEnd(docsId: string, currentUsers: ScriptUser[]): Promise<void>;

  clear(editor?: Editor): void;
}

interface Props
{
}

//@ts-ignore
const context: State = {};

const asyncFunctionDebounced = AwesomeDebouncePromise(async (text: Node[]) =>
{
  let pureText = "";
  text.forEach((t, i) =>
  {
    (t.children as []).forEach((c: { text: string; data?: any }) =>
    {
      pureText += c?.text ?? "";
      pureText += c?.data?.text ?? "";
    });
    if (i < text.length - 1)
    {
      pureText += "\n";
    }
  });
  return pureText;
}, 500);

export const EditorContext = React.createContext(context);

export default class EditorProvider extends Component<Props, State>
{
  constructor(props: Props)
  {
    super(props);
    this.state = {
      value: [
        {
          type: "paragraph",
          children: [{text: ""}],
        },
      ],
      onChange: this.onChange,
      onSendEnd: this.onSendEnd,
      insertSettings: this.insertSettings,
      setSelectedContent: this.setSelectedContent,
      clear: this.clear,
    };
  }

  onSendEnd = async (docsId: string, currentUsers: ScriptUser[]) =>
  {
    let user = this.getUserInfo();
    let doc = firebase.firestore().collection("scripts").doc(docsId);
    let foundUsers = currentUsers.filter((c) => c.userID === user?.userID);
    if (foundUsers.length > 0)
    {
      let foundUser = foundUsers[0];
      //@ts-ignore
      foundUser.currentTyping = null;
      await doc.update({currentUsers: currentUsers});
    }
  };

  onChange = async (
      value: Node[],
      docsId: string,
      currentUsers: ScriptUser[]
  ) =>
  {
    this.setState({value});
    let text = await asyncFunctionDebounced(value);
    if (text.length > 0)
    {
      let user = this.getUserInfo();
      let doc = firebase.firestore().collection("scripts").doc(docsId);
      let foundUsers = currentUsers.filter((c) => c.userID === user?.userID);
      if (foundUsers.length > 0)
      {
        let foundUser = foundUsers[0];
        foundUser.currentTyping = text;
        await doc.update({currentUsers: currentUsers});
      }
    } else
    {
      await this.onSendEnd(docsId, currentUsers);
    }
  };

  getUserInfo = () =>
  {
    let currentUser = firebase.auth().currentUser;
    if (currentUser)
    {
      let userInfo: ScriptUser = {
        username: currentUser.displayName ?? "annoymous",
        userID: currentUser.uid,
      };
      return userInfo;
    }
  };

  setSelectedContent = (content?: Content, editor?: Editor) =>
  {
    if (content)
    {
      let value = content.content;
      this.setState({value: value as any});
    } else
    {
      this.clear(editor);
    }
    this.setState({selectedContent: content});
  };

  insertSettings = (settings: SettingsDetail, editor: Editor) => {
    const node: Node = {
      type: "settings",
      children: [{text: settings.title}],
      data: {id: settings.id, text: settings.title},
    };
    editor.insertNode(node);
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
