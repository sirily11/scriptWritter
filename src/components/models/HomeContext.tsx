import React, { Component } from "react";
import firebase, { User } from "firebase";
import { Room, ScriptUser } from "./scriptWriterInterfaces";

interface State {
  user?: User | null;

  signOut(): Promise<void>;

  login(email: string, password: string): Promise<void>;

  signUp(email: string, password: string): Promise<void>;

  createScript(title: string, description: string): Promise<void>;
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
      login: this.login,
      signUp: this.signUp,
      createScript: this.createScript,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.setState({ user: user });
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
        window.location.href = "#home";
      } else {
        this.setState({ user: null });
        window.location.href = "#";
      }
    });
  }

  createScript = async (title: string, description: string) => {
    let scriptRoom: Room = {
      title: title,
      description: description,
      settings: [],
      content: [],
    };
    await firebase.firestore().collection("scripts").add(scriptRoom);
  };

  signOut = async () => {
    await firebase.auth().signOut();
    this.setState({ user: null });
    window.location.href = "#";
  };

  login = async (email: string, password: string) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
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
