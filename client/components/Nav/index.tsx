"use client";
import { useState } from "react";
import { styled } from "@mui/material/styles";
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
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import LoadingButton from "@mui/lab/LoadingButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./styles.scss";
import { useRouter } from "next/navigation";

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

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1
});

const createItem = async (data: FormData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/item/add-new`, {
    method: "POST",
    body: data,
    credentials: "include"
  });

  return response.ok;
};

function NewItemModal({ open, handleClose }: {
  open: boolean,
  handleClose: () => void
}) {

  const router = useRouter();

  const [data, setData] = useState<{ name: string, description: "", price: number, image: null | File }>({
    name: "",
    description: "",
    price: 0,
    image: null
  });

  const [state, setState] = useState({
    error: false,
    errorMessage: "",
    loading: false
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "image") {
      setData({
        ...data,
        image: e.target.files![0]
      });
    } else {

      setData({
        ...data,
        [e.target.name]: e.target.value
      });
    }
    clearError();
  };

  const validate = () => {
    if (!data.name || !data.description || !data.price || !data.image) {
      setError("Please fill in all fields");
      return false;
    }

    if (data.price < 0 || data.price === 0) {
      setError("Price must be a positive number");
      return false;
    }

    return true;
  };

  const setError = (message: string) => {
    setState({
      ...state,
      error: true,
      errorMessage: message
    });
  };

  const clearError = () => {
    setState({
      ...state,
      error: false,
      errorMessage: ""
    });
  };

  const setLoading = (loading: boolean) => {
    setState(prev => {return { ...prev, loading };});
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    const isValid = validate();

    if (!isValid) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("image", data.image as File);

    const isSuccess = await createItem(formData);

    setLoading(false);
    if (isSuccess) {
      router.refresh();
      handleClose();
    } else {
      setError("Something went wrong, please try again later");
      return;
    }
  };

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
          type="text"
          name="name"
          fullWidth
          variant="standard"
          onChange={onChange}
          disabled={state.loading} />
        <TextField
          margin="normal"
          id="item-description"
          label="Item Description"
          name="description"
          fullWidth
          multiline
          maxRows={4}
          variant="standard"
          onChange={onChange}
          disabled={state.loading}
        />
        <FormControl margin="normal" fullWidth variant="standard">
          <InputLabel htmlFor="item-amount">Amount</InputLabel>
          <Input
            id="item-amount"
            type="number"
            name="price"
            startAdornment={<InputAdornment position="start">£</InputAdornment>}
            onChange={onChange}
            disabled={state.loading}
          />
        </FormControl>
        <Button size="small" component="label" variant="contained" startIcon={<CloudUploadIcon />}
                sx={{ marginTop: "10px" }}>
          Upload Image
          <VisuallyHiddenInput type="file" accept="image/png, image/jepg, image/jpg" name="image" onChange={onChange} />
        </Button>
      </DialogContent>
      <DialogContent>
        {
          state.error && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {state.errorMessage}
            </Alert>
          )
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="contained" disableElevation
                disabled={state.loading}>Cancel</Button>
        <LoadingButton
          onClick={handleSubmit}
          color="success"
          variant="contained"
          disableElevation
          disabled={state.error || state.loading}
          loading={state.loading}>
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}