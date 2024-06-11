import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
} from "@mui/material";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function ActionsToDeposites({ dataOfDeposit }) {
  let { setEditBankDeposit, data, setDeleteBankDeposit } = dataOfDeposit;
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
              setEditBankDeposit({
                depositData: data,
                openModal: true,
              });
              setAnchorEl(null);
            }}
          >
            <ListItemText primary="Edit" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setDeleteBankDeposit({
                depositData: data,
                openModal: true,
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
export default ActionsToDeposites;
