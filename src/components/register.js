import React, { useContext, useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { FormHelperText, MenuItem } from "@material-ui/core";
import AuthContext from "../utils/authContext";
import LoadingSpinner from "./LoadingSpinner";
import { useHistory } from "react-router-dom";
import checkInput from "../utils/validator";
import axios from "axios";
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
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    zIndex: 10,
  },
  previewAvatar: {
    width: "64px",
    height: "64px",
  },
}));

const getAllCourses = async () => {
  let courses;
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_ENDPOINT_DEVELOPMENT}/api/v1/courses`
    );
    courses = response.data;
    return courses;
  } catch (error) {
    return null;
  }
};

const Register = () => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [input, setInput] = useState({
    studentName: auth.authData ? auth.authData.name : "",
    nationality: "",
    message: "",
    studentNumber: auth.authData ? auth.authData.userName.substring(1, 8) : "",
    currentCourses: [],
  });
  const [inputError, setInputError] = useState({
    nationality: "",
    message: "",
    currentCourses: "",
  });
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCoursesData = async () => {
      const courses = await getAllCourses();
      setCourses(courses);
    };
    getCoursesData();
  }, []);
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

  const handleSubmitForm = async e => {
    e.preventDefault();
    let user;
    const data = {
      studentID: input.studentNumber,
      name: input.studentName,
      nationality: input.nationality,
      message: input.message,
    };
    setIsLoading(true);
    let responseObj;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_ENDPOINT_DEVELOPMENT}/api/v1/users`,
        data
      );
      responseObj = response.data;
      user = { ...data };
      user.cardID = responseObj.cardId;
    } catch (error) {
      responseObj = error.response.data;
    }
    if (responseObj.status !== "success") {
      setIsLoading(false);
      return setTimeout(() => alert(responseObj.message), 100);
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_ENDPOINT_DEVELOPMENT}/api/v1/courses`,
        { studentID: input.studentNumber, courseID: input.currentCourses }
      );
      responseObj = response.data;
    } catch (error) {
      responseObj = error.response.data;
    }
    if (responseObj.status !== "success") {
      setIsLoading(false);
      return setTimeout(() => alert(responseObj.message), 100);
    }
    auth.login({ user });
    setIsLoading(false);
    setTimeout(() => {
      alert("Successfully register your card");
      history.push("/profile");
    }, 100);
  };

  if (!auth.authData) {
    history.push("/");
  }
  console.log(courses);
  return (
    auth.authData && (
      <Container component="main" maxWidth="xs">
        <LoadingSpinner isLoading={isLoading} />
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register card
          </Typography>
          <form className={classes.form} onSubmit={handleSubmitForm}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="email"
              label="Email Address"
              value={auth.authData.userName}
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
              <FormHelperText error={true}>
                {inputError.studentName}
              </FormHelperText>
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
                value: input.nationality,
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
            <TextField
              color="primary"
              select
              variant="outlined"
              margin="normal"
              fullWidth
              label="Current courses"
              name="currentCourses"
              SelectProps={{
                multiple: true,
                value: input.currentCourses,
                onChange: handleOnInputChange,
              }}
            >
              {courses.map(course => (
                <MenuItem key={course.courseID} value={course.courseID}>
                  {course.name}
                </MenuItem>
              ))}
            </TextField>
            {inputError.currentCourses && (
              <FormHelperText error={true}>
                {inputError.currentCourses}
              </FormHelperText>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={Object.keys(inputError).length > 0}
            >
              Register
            </Button>
          </form>
        </div>
      </Container>
    )
  );
};

export default Register;
