import { Modal, Box, Typography, Button } from "@mui/material";
import React from "react";

function DetailedProducts({ data }) {
  let { ViewPdoductInfo, setViewPdoductInfo } = data;
  return (
    <div>
      {" "}
      <Modal open={ViewPdoductInfo.Open}>
        <Box className="modalBox">
          <Box>
            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>
            <Box mb={2}>
              <strong>Name:</strong> {ViewPdoductInfo.Product.productName}
            </Box>
            <Box mb={2}>
              <strong>Unit Price:</strong>{" "}
              {ViewPdoductInfo.Product.productsUnitPrice}
            </Box>
            <Box mb={2}>
              <strong>Unit Cost:</strong>{" "}
              {ViewPdoductInfo.Product.productsUnitCost}
            </Box>
            <Box mb={2}>
              <strong>Minimum Qty:</strong> {ViewPdoductInfo.Product.minimumQty}
            </Box>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                setViewPdoductInfo((Prev) => {
                  return { ...Prev, Open: false };
                });
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default DetailedProducts;
