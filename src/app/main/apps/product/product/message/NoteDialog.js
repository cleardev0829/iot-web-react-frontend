import { useForm } from "@fuse/hooks";
import Path from "path";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeNote,
  saveNote,
  uploadFile,
  deleteFile,
  closeNewNoteDialog,
  closeEditNoteDialog,
} from "../../store/noteSlice";
import { openDialog, closeDialog } from "app/store/fuse/dialogSlice";
import { makeid } from "app/utils/Functions";
import path from "path";
import FormUploadFile from "./FormUploadFile";
import { openImageDialog } from "../../store/dialogSlice";

const defaultFormState = {
  id: "",
  title: "",
  note: "",
  messageId: "",
  fileObjs: [],
  files: [],
  urls: [],
};

function NoteDialog(props) {
  const dispatch = useDispatch();
  const noteDialog = useSelector(
    ({ productApp }) => productApp.notes.noteDialog
  );

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { form, handleChange, setForm } = useForm({ ...defaultFormState });

  const initDialog = useCallback(async () => {
    /**
     * Dialog type: 'edit'
     */
    let _fileObjs = [];
    let _files = [];
    if (noteDialog.type === "edit" && noteDialog.data) {
      noteDialog.data.urls.map((url) =>
        fetch(url).then((response) => {
          response.blob().then((blob) => {
            const file = new File([blob], Path.basename(url), {
              type: blob.type,
              lastModified: new Date(),
            });
            const reader = new FileReader();
            reader.readAsDataURL(blob);

            reader.onload = () => {
              _fileObjs.push(reader.result);
              _files.push(file);

              setForm({
                ...noteDialog.data,
                fileObjs: _fileObjs,
                files: _files,
              });
            };
          });
        })
      );

      setForm({
        ...defaultFormState,
        ...noteDialog.data,
        fileObjs: _fileObjs,
        files: _files,
      });
    }

    /**
     * Dialog type: 'new'
     */
    if (noteDialog.type === "new") {
      setForm({
        ...defaultFormState,
        ...noteDialog.data,
        fileObjs: _fileObjs,
        files: _files,
      });
    }
  }, [noteDialog.data, noteDialog.type, setForm]);

  useEffect(() => {
    /**
     * After Dialog Open
     */
    if (noteDialog.props.open) {
      initDialog();
    }
  }, [noteDialog.props.open, initDialog]);

  function closeNoteDialog() {
    return noteDialog.type === "edit"
      ? dispatch(closeEditNoteDialog())
      : dispatch(closeNewNoteDialog());
  }

  function handleUploadChange(e) {
    setUploading(true);

    const file = e.target.files[0];
    const blob = file.slice(0, file.size, file.type);
    const uid = makeid(30);
    const newFile = new File([blob], `${uid}-${file.name}`, {
      type: file.type,
    });

    if (!file) {
      setUploading(false);
      return;
    }

    dispatch(
      uploadFile({ containerName: "rocket-iot-notes", file: newFile })
    ).then((response) => {
      const url = response.payload;
      const reader = new FileReader();

      reader.readAsBinaryString(newFile);

      reader.onload = () => {
        let _fileObjs = form.fileObjs;
        let _files = form.files;
        let _urls = [...form.urls];

        _fileObjs.push(`data:${file.type};base64,${btoa(reader.result)}`);
        _files.push(newFile);
        _urls.push(url);

        setForm({ ...form, fileObjs: _fileObjs, files: _files, urls: _urls });

        dispatch(saveNote({ ...form, urls: _urls })).then(() => {
          setUploading(false);
        });
      };

      reader.onerror = () => {
        console.log("error on load file");
      };
    });
  }

  function handleRemoveFile() {
    setDeleting(true);

    const url = form.urls[form.urls.length - 1];

    dispatch(
      deleteFile({
        containerName: "rocket-iot-notes",
        fileName: path.basename(url),
      })
    ).then(() => {
      const _fileObjs = form.fileObjs.slice(0, form.fileObjs.length - 1);
      const _files = form.files.slice(0, form.files.length - 1);
      const _urls = form.urls.slice(0, form.urls.length - 1);

      setForm({
        ...form,
        fileObjs: _fileObjs,
        files: _files,
        urls: _urls,
      });

      dispatch(saveNote({ ...form, urls: _urls })).then(() => {
        setDeleting(false);
      });
    });
  }

  function canBeSubmitted() {
    return form.title.length > 0;
  }

  return (
    <Dialog
      {...noteDialog.props}
      onClose={closeNoteDialog}
      fullWidth
      maxWidth="sm"
      classes={{
        paper: "rounded-8",
      }}
    >
      <AppBar position="static" className="shadow-md">
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {noteDialog.type === "new" ? "New Note" : "Edit Note"}
          </Typography>
        </Toolbar>
      </AppBar>

      <DialogContent classes={{ root: "p-0 mt-12" }}>
        <div className="px-16 sm:px-24">
          <FormControl className="mt-8 mb-16" required fullWidth>
            <TextField
              label="Title"
              autoFocus
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </FormControl>

          <FormControl className="mt-8 mb-16" required fullWidth>
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

          {uploading && <Typography>Uploading...</Typography>}

          {deleting && <Typography>Deleting...</Typography>}

          {form.fileObjs && form.fileObjs.length > 0 && (
            <FormControl className="mt-8 mb-16" required fullWidth>
              <div className="relative">
                <div className="flex flex-row items-center">
                  {form.fileObjs.map((fileObj, index) => (
                    <img
                      key={index}
                      src={fileObj}
                      className="w-52 h-52 mr-8 block rounded"
                      alt="note"
                      onClick={() => dispatch(openImageDialog(fileObj))}
                    />
                  ))}
                </div>

                {!uploading && !deleting && (
                  <Fab
                    className="absolute right-0 bottom-0 m-8"
                    variant="extended"
                    size="small"
                    color="secondary"
                    aria-label="Delete File"
                    onClick={handleRemoveFile}
                  >
                    <Icon fontSize="small">delete</Icon>
                  </Fab>
                )}
              </div>
            </FormControl>
          )}

          {noteDialog.type === "edit" && !uploading && !deleting && (
            <FormControl className="mt-8 mb-16" required fullWidth>
              <Tooltip title="Add file" placement="bottom">
                <div>
                  <FormUploadFile onChange={handleUploadChange} />
                </div>
              </Tooltip>
            </FormControl>
          )}
        </div>
      </DialogContent>

      {noteDialog.type === "new" ? (
        <DialogActions className="justify-between p-8">
          <div className="px-16">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                dispatch(saveNote({ ...form, isNotes: true })).then(() => {
                  closeNoteDialog();
                });
              }}
              disabled={!canBeSubmitted()}
            >
              Add
            </Button>
          </div>
        </DialogActions>
      ) : (
        <DialogActions className="justify-between p-8">
          <div className="px-16">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                dispatch(saveNote({ ...form, isNote: true })).then(() => {
                  closeNoteDialog();
                });
              }}
              disabled={!canBeSubmitted()}
            >
              Save
            </Button>
          </div>
          <IconButton
            className="min-w-auto"
            onClick={() => {
              dispatch(
                openDialog({
                  children: (
                    <React.Fragment>
                      <DialogTitle id="alert-dialog-title">
                        Are you really delete?
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          {`You will be lost thie notes`}.
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => dispatch(closeDialog())}
                          color="primary"
                        >
                          Disagree
                        </Button>
                        <Button
                          onClick={() =>
                            dispatch(
                              removeNote({
                                isNotes: false,
                                messageId: form.messageId,
                                title: "",
                                notes: "",
                                urls: [],
                                files: [],
                                fileObj: [],
                              })
                            ).then(() => {
                              closeNoteDialog();
                              dispatch(closeDialog());
                            })
                          }
                          color="primary"
                          autoFocus
                        >
                          Agree
                        </Button>
                      </DialogActions>
                    </React.Fragment>
                  ),
                })
              );
            }}
          >
            <Icon>delete</Icon>
          </IconButton>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default NoteDialog;
