// @flow
import * as React        from "react";
import FormatBoldIcon    from "@material-ui/icons/FormatBold";
import FormatItalicIcon  from "@material-ui/icons/FormatItalic";
import ToggleButton      from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import {useSlate}        from "slate-react";

type Props = {};

export function EditorToolbar(props: Props)
{
  const editor = useSlate();
  const [formats, setFormats] = React.useState(() => ["bold", "italic"]);

  const handleFormat = (
      event: React.MouseEvent<HTMLElement>,
      newFormats: string[]
  ) =>
  {
    setFormats(newFormats);
  };

  return (
      <ToggleButtonGroup
          value={formats}
          onChange={handleFormat}
          aria-label="text formatting"
      >
        <ToggleButton value="bold" aria-label="bold">
          <FormatBoldIcon/>
        </ToggleButton>
        <ToggleButton value="italic" aria-label="italic">
          <FormatItalicIcon/>
        </ToggleButton>
      </ToggleButtonGroup>
  );
}
