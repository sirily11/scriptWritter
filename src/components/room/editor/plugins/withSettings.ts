import {ReactEditor} from "slate-react";

export const withSettings = (editor: ReactEditor) =>
{
  const {isInline, isVoid} = editor;

  editor.isInline = (element) =>
  {
    return element.type === "settings" ? true : isInline(element);
  };

  editor.isVoid = (element) =>
  {
    return element.type === "settings" ? true : isVoid(element);
  };

  return editor;
};
