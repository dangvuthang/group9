import React, { useContext, useState } from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import checkInput from "../utils/validator";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import AuthContext from "../utils/authContext";
const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    background: "#fff",
    border: "1px solid #dedfe0",
  },

  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const UserProfile = ({ input, setInput }) => {
  const classes = useStyles();
  const [inputError, setInputError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const handleOnInputChange = event => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
    const message = checkInput(name, value);
    if (message) setInputError({ ...inputError, [name]: message });
    else {
      let error = { ...inputError };
      delete error[name];
      setInputError(error);
    }
  };
  const handleOnSubmit = async e => {
    e.preventDefault();
    const data = {
      message: input.message,
      name: input.studentName,
      nationality: input.nationality,
    };
    setIsLoading(true);
    try {
      await axios.patch(
        `https://group-9.herokuapp.com/api/v1/users/${input.studentNumber}`,
        data
      );
      const updatedUserData = {
        studentID: auth.user.studentID,
        name: input.studentName,
        nationality: input.nationality,
        message: input.message,
        cardID: auth.user.cardID,
      };
      auth.login({ user: updatedUserData });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Typography
        color="primary"
        variant="h5"
        align="center"
        gutterBottom={true}
      >
        My Profile
      </Typography>
      <Typography paragraph={true} align="center" gutterBottom={true}>
        Update information about yourself
      </Typography>
      <form className={classes.form} onSubmit={handleOnSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="email"
          label="Email Address"
          value={`s${input.studentNumber}.rmit.edu.vn`}
          disabled
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Student Number"
          name="studentNumber"
          disabled
          value={input.studentNumber}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Student Name"
          name="studentName"
          value={input.studentName}
          onChange={handleOnInputChange}
        />
        {inputError.studentName && (
          <FormHelperText error={true}>{inputError.studentName}</FormHelperText>
        )}
        <TextField
          select
          name="nationality"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Nationality"
          SelectProps={{
            value: [input.nationality],
            onChange: handleOnInputChange,
          }}
        >
          {[
            "Vietnamese",
            "English",
            "American",
            "Indian",
            "Australian",
            "Korean",
            "Japanese",
            "Chinese",
          ].map(nationality => (
            <MenuItem value={nationality} key={nationality}>
              {nationality}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          multiline
          variant="outlined"
          margin="normal"
          fullWidth
          label="Message to speak"
          name="message"
          rows={4}
          value={input.message}
          onChange={handleOnInputChange}
        />
        {inputError.message && (
          <FormHelperText error={true}>{inputError.message}</FormHelperText>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={Object.keys(inputError).length > 0 || isLoading}
        >
          {isLoading ? "Processing..." : "Update"}
        </Button>
      </form>
    </Container>
  );
};

export default UserProfile;
