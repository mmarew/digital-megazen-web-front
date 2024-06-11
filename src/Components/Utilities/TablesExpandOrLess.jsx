import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import tableNavCSS from "../../CSS/Tablenav.module.css";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import HRTAG from "./HRTAG";
function TablesExpandOrLess({ data }) {
  let { minimizeTable, setminimizeTable, Title } = data;
  return (
    <div>
      {" "}
      <Box className={tableNavCSS.tableHead}>
        <Typography className={tableNavCSS.tableHeadTitle}>{Title}</Typography>

        <IconButton
          className={tableNavCSS.iconButtonExpandOrMinimize}
          onClick={() => setminimizeTable(!minimizeTable)}
        >
          {minimizeTable ? (
            <ExpandMore className={tableNavCSS.expandMore} />
          ) : (
            <ExpandLess className={tableNavCSS.expandLess} />
          )}
        </IconButton>
      </Box>
      <HRTAG />
    </div>
  );
}

export default TablesExpandOrLess;
