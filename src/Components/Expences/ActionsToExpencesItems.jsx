import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
} from "@mui/material";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function ActionsToExpencesItems({ data }) {
  let {
    openEditingModal,
    openDeletingModal,
    setopenEditingModal,
    setopenDeletingModal,
    cost,
  } = data;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <div>
      <IconButton aria-label="Menu" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
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
              setopenEditingModal({
                open: true,
                cost,
                // index,
              });
              setAnchorEl(null);
            }}
          >
            <ListItemText primary="Edit" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setopenDeletingModal({
                open: true,
                item: cost,
              });
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
export default ActionsToExpencesItems;
