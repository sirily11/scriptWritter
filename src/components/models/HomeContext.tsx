import React, {Component}                    from "react";
import firebase, {User}                      from "firebase";
import {Content, Room, ScriptUser, Settings} from "./scriptWriterInterfaces";
import {v4 as uuidv4}                        from "uuid";

interface State
{
  user?: User | null;
  room: Room[];
  isLoading: boolean;

  refreshRoom(): Promise<void>;

  post(docsId: string, value: any): Promise<void>;

  editScript(docsId: string, title: string, description: string): Promise<void>;

  editPost(
      docsId: string,
      contentId: string,
      newValue: any,
      oldContents: Content[]
  ): Promise<void>;

  deletePost(docsId: string, value: Content): Promise<void>;

  signOut(): Promise<void>;

  login(email: string, password: string): Promise<void>;

  signUp(email: string, password: string): Promise<void>;

  createScript(title: string, description: string): Promise<void>;

  createSettings(
    title: string,
    docsId: string,
    settings: Settings[]
  ): Promise<void>;

  createDetails(
    index: number,
    docsId: string,
    title: string,
    content: string,
    settings: Settings[]
  ): Promise<void>;

  updateSettings(
    index: number,
    docsId: string,
    title: string,
    settings: Settings[]
  ): Promise<void>;

  updateDetails(
    index: number,
    detailIndex: number,
    docsId: string,
    title: string,
    content: string,
    settings: Settings[]
  ): Promise<void>;

  deleteSettings(
    index: number,
    docsId: string,
    settings: Settings[]
  ): Promise<void>;

  deleteDetails(
    index: number,
    detailIndex: number,
    docsId: string,
    settings: Settings[]
  ): Promise<void>;
}

interface Props {}

//@ts-ignore
const context: State = {};

export const HomeContext = React.createContext(context);

export default class HomeProvider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      signOut: this.signOut,
      isLoading: false,
      login: this.login,
      signUp: this.signUp,
      createScript: this.createScript,
      createDetails: this.createDetails,
      createSettings: this.createSettings,
      updateDetails: this.updateDetails,
      updateSettings: this.updateSettings,
      deleteDetails: this.deleteDetails,
      deleteSettings: this.deleteSettings,
      editScript: this.editScript,
      editPost: this.editPost,
      post: this.post,
      deletePost: this.deletePost,
      refreshRoom: this.refresh,
      room: [],
    };
  }

  async componentDidMount() {
    // await firebase.firestore().enablePersistence();
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user)
      {
        this.setState({user: user});
        let userInfo: ScriptUser = {
          username: user.displayName ?? "",
          userID: user.uid,
        };
        // Add user to firestore
        await firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .set(userInfo);
        await this.refresh();
      } else
      {
        this.setState({user: null});
        window.location.href = "#";
      }
    });
  }

  refresh = async () =>
  {
    this.setState({isLoading: true});
    let docs = await firebase.firestore().collection("scripts").get();
    let data: Room[] = [];
    docs.forEach((d) =>
    {
      data.push({id: d.id, ...d.data()} as Room);
    });
    this.setState({room: data, isLoading: false});
  };

  post = async (docsId: string, value: any) =>
  {
    let content: Content = {
      id: uuidv4(),
      time: firebase.firestore.Timestamp.fromMillis(Date.now()),
      content: value,
      user: {
        username: firebase.auth().currentUser?.displayName ?? "",
        userID: firebase.auth().currentUser?.uid ?? "",
      },
    };
    await firebase
      .firestore()
      .collection("scripts")
      .doc(docsId)
      .update("content", firebase.firestore.FieldValue.arrayUnion(content));
  };

  editPost = async (
    docsId: string,
    contentId: string,
    newValue: any,
    oldContents: Content[]
  ) => {
    let contents = oldContents.filter((c) => c.id === contentId);
    if (contents) {
      contents[0].content = newValue;
    }
    let docs = await firebase.firestore().collection("scripts").doc(docsId);
    let snapshot = await docs.get();
    let currentUserId = firebase.auth().currentUser?.uid;
    let data = snapshot.data() as Room;
    if (
      data.admin === currentUserId ||
      contents[0].user.userID === currentUserId
    ) {
      docs.update("content", oldContents);
    } else {
      alert("You cannot update this content");
    }
  };

  deletePost = async (docsId: string, value: Content) => {
    let confirm = window.confirm("Do you want to delete this post?");
    if (confirm) {
      let docs = await firebase.firestore().collection("scripts").doc(docsId);
      let snapshot = await docs.get();
      let currentUserId = firebase.auth().currentUser?.uid;
      let data = snapshot.data() as Room;
      if (data.admin === currentUserId || value.user.userID === currentUserId) {
        docs.update(
          "content",
          firebase.firestore.FieldValue.arrayRemove(value)
        );
      } else {
        alert("You cannot delete this content");
      }
    }
  };

  createSettings = async (
    title: string,
    docsId: string,
    settings: Settings[]
  ) => {
    settings.push({ type: title, details: [], id: uuidv4() });
    await firebase
      .firestore()
      .collection("scripts")
      .doc(docsId)
      .update("settings", settings);
  };
  createDetails = async (
    index: number,
    docsId: string,
    title: string,
    content: string,
    settings: Settings[]
  ) => {
    settings[index].details.push({
      title: title,
      content: content,
      id: uuidv4(),
    });
    await firebase
      .firestore()
      .collection("scripts")
      .doc(docsId)
      .update("settings", settings);
  };
  updateSettings = async (
    index: number,
    docsId: string,
    title: string,
    settings: Settings[]
  ) => {
    settings[index].type = title;
    await firebase
      .firestore()
      .collection("scripts")
      .doc(docsId)
      .update("settings", settings);
  };
  updateDetails = async (
    index: number,
    detailIndex: number,
    docsId: string,
    title: string,
    content: string,
    settings: Settings[]
  ) => {
    console.log(settings, index, detailIndex);
    settings[index].details[detailIndex].title = title;
    settings[index].details[detailIndex].content = content;

    await firebase
      .firestore()
      .collection("scripts")
      .doc(docsId)
      .update("settings", settings);
  };
  deleteSettings = async (
    index: number,
    docsId: string,
    settings: Settings[]
  ) => {
    let confirm = window.confirm("Do you want to delete this setting?");
    if (confirm) {
      settings.splice(index, 1);
      await firebase
        .firestore()
        .collection("scripts")
        .doc(docsId)
        .update("settings", settings);
    }
  };
  deleteDetails = async (
    index: number,
    detailIndex: number,
    docsId: string,
    settings: Settings[]
  ) => {
    let confirm = window.confirm("Do you want to delete this detail?");
    if (confirm) {
      settings[index].details.splice(detailIndex, 1);
      await firebase
        .firestore()
        .collection("scripts")
        .doc(docsId)
        .update("settings", settings);
    }
  };

  createScript = async (title: string, description: string) => {
    let scriptRoom: Room = {
      admin: firebase.auth().currentUser?.uid ?? "",
      title: title,
      description: description,
      settings: [],
      content: [],
      currentUsers: [],
    };
    await firebase.firestore().collection("scripts").add(scriptRoom);
  };

  editScript = async (docsId: string, title: string, description: string) => {
    let docs = firebase.firestore().collection("scripts").doc(docsId);
    await docs.update({ title: title, description: description });
  };

  signOut = async () => {
    await firebase.auth().signOut();
    this.setState({ user: null });
    window.location.href = "#";
  };

  login = async (email: string, password: string) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      window.location.href = "#home";
    } catch (e) {
      window.alert(e);
    }
  };

  signUp = async (email: string, password: string) => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (e) {
      window.alert(e);
    }
  };

  render() {
    return (
      <HomeContext.Provider value={this.state}>
        {this.props.children}
      </HomeContext.Provider>
    );
  }
}
