import React from "react";
import Table from "@material-ui/core/Table";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import dayjs from "dayjs";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const compare = (classStartAt, userScannedAt) => {
  let startAt = parseInt(classStartAt.replaceAll(":", ""));
  let scannedAt = parseInt(userScannedAt.replaceAll(":", ""));
  if (startAt > scannedAt || startAt === scannedAt) return "On Time";
  else return "Late";
};

const Attendance = ({ attendance }) => {
  const classes = useStyles();
  console.log(attendance);
  return (
    <TableContainer component={Paper}>
      <Typography></Typography>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>CourseID</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Class On</TableCell>
            <TableCell>Week</TableCell>
            <TableCell>Class Start At</TableCell>
            <TableCell>Scanned At</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendance.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.courseId}
              </TableCell>
              <TableCell>{row.courseName}</TableCell>
              <TableCell>
                {dayjs(row.scannedOn).format("ddd, DD/MM/YY")}
              </TableCell>
              <TableCell>
                Week {dayjs(row.scannedOn).diff(dayjs("2020-11-1"), "w") + 1}
              </TableCell>
              <TableCell>{row.classAt}</TableCell>
              <TableCell>{row.scannedAt}</TableCell>
              <TableCell>{compare(row.classAt, row.scannedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Attendance;
