"use client";
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import "./styles.scss";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

export default function NavBar() {

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="nav-bar">
      <button onClick={handleOpen}>
        Create Item
      </button>
      <NewItemModal open={open} handleClose={handleClose} />
    </div>
  );
}

function NewItemModal({ open, handleClose }: { open: boolean, handleClose: () => void }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      aria-labelledby="new-item-dialog-title"
      aria-describedby="new-item-dialog-description"
    >
      <DialogTitle id="new-item-dialog-title">
        Create New Item
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="new-item-dialog-description">
          Create a new item here.
        </DialogContentText>
        <TextField
          autoFocus
          margin="normal"
          id="item-name"
          label="Item Name"
          type="name"
          fullWidth
          variant="standard" />
        <TextField
          margin="normal"
          id="item-description"
          label="Item Description"
          fullWidth
          multiline
          maxRows={4}
          variant="standard"
        />
        <FormControl margin="normal" fullWidth variant="standard">
          <InputLabel htmlFor="item-amount">Amount</InputLabel>
          <Input
            id="item-amount"
            type="number"
            startAdornment={<InputAdornment position="start">£</InputAdornment>}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleClose} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}