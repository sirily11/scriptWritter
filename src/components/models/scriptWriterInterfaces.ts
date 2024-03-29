export interface Room {
    title: string;
    description: string;
    id?: string;
    cover?: string;
    settings: Settings[];
    content: Content[];
    currentUsers: ScriptUser[];
    admin: string;
}

export interface ScriptUser
{
    username: string;
    userID: string;
    currentTyping?: string;
}

export interface Content {
  id: string;
  time: any;
  user: ScriptUser;
  content: string;
}

export interface Settings {
  id: string;
  type: string;
  details: SettingsDetail[];
}

export interface SettingsDetail {
  id: string;
  title: string;
  content?: string;
}
