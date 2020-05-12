export interface Room {
  title: string;
  description: string;
  id?: string;
  cover?: string;
  settings: Settings[];
  content: Content[];
}

export interface ScriptUser {
  username: string;
  userID: string;
}

export interface Content {
  time: any;
  user: ScriptUser;
  content: string;
}

export interface Settings {
  type: string;
  details: SettingsDetail[];
}

export interface SettingsDetail {
  title: string;
  content?: string;
}
