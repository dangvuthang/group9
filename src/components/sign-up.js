import React, { useContext, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import MicrosoftLogin from "react-microsoft-login";
import axios from "axios";
import { useHistory } from "react-router-dom";
import AuthContext from "../utils/authContext";
import LoadingSpinner from "./LoadingSpinner";
const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const checkUser = async id => {
    try {
      const response = await axios.post(
        `https://group-9.herokuapp.com/api/v1/users/check`,
        { studentID: id }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return null;
    }
  };

  const handleOnAuth = async (error, authData, msal) => {
    if (authData) {
      console.log(authData);
      if (authData.account.userName.endsWith("@rmit.edu.vn")) {
        console.log(authData);
        const id = authData.account.userName.substring(1, 8);
        const user = await checkUser(id);
        setIsLoading(true);
        if (!user) {
          auth.login({ authData: authData.account });
          setIsLoading(false);
          history.push("/register");
        } else {
          setIsLoading(false);
        }
      } else alert("Please use your rmit accoutn to login");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      {isLoading && <LoadingSpinner isLoading={isLoading} />}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <h3>Please use the provided rmit account to login</h3>
        <MicrosoftLogin
          clientId="846fecbc-f462-4716-8d6f-1e7f0682b998"
          authCallback={(error, authData, msal) =>
            handleOnAuth(error, authData, msal)
          }
          prompt="select_account"
          buttonTheme="light_short"
          label="Sign in"
        />
      </div>
    </Container>
  );
}
