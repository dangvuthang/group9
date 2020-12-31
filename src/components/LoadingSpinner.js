import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress, Backdrop } from "@material-ui/core";
const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 10,
  },
}));

const LoadingSpinner = ({ isLoading }) => {
  const classes = useStyles();
  return (
    <Backdrop open={isLoading} classes={{ root: classes.root }}>
      <CircularProgress color="secondary" />
    </Backdrop>
  );
};

export default LoadingSpinner;
