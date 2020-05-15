// @flow
import * as React            from "react";
import {useContext}          from "react";
import {Button, ButtonGroup} from "@material-ui/core";
import {HomeContext}         from "../models/HomeContext";

type Props = {};

export function PaginationButton(props: Props)
{
  const {next, previous, hasNext, hasPrevious} = useContext(HomeContext);

  return (
      <ButtonGroup
          variant="contained"
          color="primary"
          aria-label="outlined secondary button group"
      >
        <Button disabled={!hasPrevious} onClick={() => previous()}>
          Previous
        </Button>
        <Button disabled={!hasNext} onClick={() => next()}>
          Next
        </Button>
      </ButtonGroup>
  );
}
