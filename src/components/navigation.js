import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ContactsIcon from "@material-ui/icons/Contacts";
import ScheduleIcon from "@material-ui/icons/Schedule";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useHistory } from "react-router-dom";

const Navigation = ({ auth }) => {
  const history = useHistory();
  const handleChangeNav = location => {
    history.push(location);
  };
  const handleLogout = () => {
    auth.logout();
    history.push("/");
  };
  return (
    <div>
      <ListItem button onClick={() => handleChangeNav("/profile")}>
        <ListItemIcon>
          <ContactsIcon />
        </ListItemIcon>
        <ListItemText primary="My Info" />
      </ListItem>
      <ListItem button onClick={() => handleChangeNav("/profile/attendance")}>
        <ListItemIcon>
          <ScheduleIcon />
        </ListItemIcon>
        <ListItemText primary="My Attendance" />
      </ListItem>
      <ListItem button onClick={handleLogout}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </div>
  );
};

export default Navigation;
