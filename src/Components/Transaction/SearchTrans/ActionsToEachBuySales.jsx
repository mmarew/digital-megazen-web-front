import { useState } from "react";
import {
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ActionsToEachItems = ({ data }) => {
  let {
    items,
    setShowDeleteConfirmationModal,
    setEditSingleItem,
    EditSingleItem,
    ShowDeleteConfirmationModal,
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
              setEditSingleItem((previousState) => {
                return {
                  ...previousState,
                  open: true,
                  Items: items,
                };
              });
              setAnchorEl(null);
            }}
          >
            <ListItemText primary="Edit" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setShowDeleteConfirmationModal((previousState) => {
                return {
                  ...previousState,
                  open: true,
                  Items: items,
                };
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
};
export default ActionsToEachItems;
