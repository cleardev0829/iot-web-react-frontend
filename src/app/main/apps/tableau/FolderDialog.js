import { useForm } from "@fuse/hooks";
import FuseUtils from "@fuse/utils";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import {
  closeNewFolderDialog,
  closeEditFolderDialog,
  createContainerInStorage,
  deleteContainerInStorage,
  isExistsContainerInStorage,
} from "./store/tableauSlice";

const defaultFormState = {
  id: "",
  name: "",
  notes: "",
};

function FolderDialog(props) {
  const dispatch = useDispatch();
  const FolderDialog = useSelector(
    ({ tableauApp }) => tableauApp.folders.FolderDialog
  );
  const prefix = useSelector(({ tableauApp }) => tableauApp.folders.prefix);

  const { form, handleChange, setForm } = useForm({ ...defaultFormState });

  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (FolderDialog.type === "edit" && FolderDialog.data) {
      setForm({ ...FolderDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (FolderDialog.type === "new") {
      setForm({
        ...defaultFormState,
        ...FolderDialog.data,
        id: FuseUtils.generateGUID(),
      });
    }
  }, [FolderDialog.data, FolderDialog.type, setForm]);

  useEffect(() => {
    /**
     * After Dialog Open
     */
    if (FolderDialog.props.open) {
      initDialog();
    }
  }, [FolderDialog.props.open, initDialog]);

  function closeFolderDialog() {
    return FolderDialog.type === "edit"
      ? dispatch(closeEditFolderDialog())
      : dispatch(closeNewFolderDialog());
  }

  function canBeSubmitted() {
    return form.name.length > 0;
  }

  return (
    <Dialog
      {...FolderDialog.props}
      onClose={closeFolderDialog}
      fullWidth
      maxWidth="sm"
      classes={{
        paper: "rounded-8",
      }}
    >
      <AppBar position="static" className="shadow-md">
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {FolderDialog.type === "new" ? "New Folder" : "Edit Folder"}
          </Typography>
        </Toolbar>
      </AppBar>

      <DialogContent classes={{ root: "p-0" }}>
        <div className="px-16 sm:px-24">
          <FormControl className="mt-8 mb-16" required fullWidth>
            <TextField
              label="Name"
              autoFocus
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </FormControl>

          <FormControl className="hidden mt-8 mb-16" required fullWidth>
            <TextField
              label="Notes"
              name="notes"
              multiline
              rows="6"
              value={form.notes}
              onChange={handleChange}
              variant="outlined"
            />
          </FormControl>
        </div>
      </DialogContent>

      {FolderDialog.type === "new" ? (
        <DialogActions className="justify-between p-8">
          <div className="px-16">
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                const response = await dispatch(
                  isExistsContainerInStorage({
                    ...form,
                    name: `tableau-${form.name}`,
                  })
                );
                const isExistsContainer = await response.payload;

                if (isExistsContainer) {
                  dispatch(
                    showMessage({
                      message: "ContainerAlreadyExists",
                      variant: "error",
                    })
                  );
                } else {
                  dispatch(
                    createContainerInStorage({
                      ...form,
                      name: `${prefix}-${form.name}`,
                    })
                  ).then(() => {
                    closeFolderDialog();
                  });
                }
              }}
              disabled={!canBeSubmitted()}
            >
              Add
            </Button>
          </div>
        </DialogActions>
      ) : (
        <DialogActions className="justify-between p-8">
          <div className="hidden px-16">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                dispatch(deleteContainerInStorage(form)).then(() => {
                  closeFolderDialog();
                });
              }}
              disabled={!canBeSubmitted()}
            >
              Save
            </Button>
          </div>
          <IconButton
            className="hidden min-w-auto"
            onClick={async () => {
              const response = await dispatch(isExistsContainerInStorage(form));
              const isExistsContainer = await response.payload;

              if (!isExistsContainer) {
                dispatch(
                  showMessage({
                    message: "The specified container does not exist",
                    variant: "error",
                  })
                );
              } else {
                dispatch(
                  deleteContainerInStorage({
                    ...form,
                  })
                ).then(() => {
                  closeFolderDialog();
                });
              }
            }}
          >
            <Icon>delete</Icon>
          </IconButton>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default FolderDialog;
