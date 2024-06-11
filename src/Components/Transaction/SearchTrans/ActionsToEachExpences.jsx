import MoreVertIcon from "@mui/icons-material/MoreVert";
import { MoreHoriz } from "@mui/icons-material";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
} from "@mui/material";
import React, { useState } from "react";

function ActionsToEachExpences({ data }) {
  const {
    items,
    setEditExpences,
    EditExpences,
    DeleteConfirmation,
    setDeleteConfirmation,
  } = data;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  return (
    <div>
      <IconButton aria-label="Menu" onClick={(e) => handleClick(e)}>
        <MoreHoriz />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List>
          <ListItem
            button
            onClick={() => {
              setEditExpences((prev) => ({
                ...prev,
                Open: true,
                item: items,
              }));
              setAnchorEl(null);
            }}
          >
            <ListItemText primary="Edit" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setDeleteConfirmation((prev) => ({
                ...prev,
                Open: true,
                item: items,
              }));
              setAnchorEl(null);
            }}
          >
            <ListItemText primary="Delete" />
          </ListItem>
        </List>
      </Popover>
    </div>
  );
}

export default ActionsToEachExpences;
