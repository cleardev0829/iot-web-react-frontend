import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseAnimate from "@fuse/core/FuseAnimate";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { makeStyles } from "@material-ui/core/styles";
import { showMessage } from "app/store/fuse/messageSlice";
import {
  listContainersInStorage,
  deleteContainerInStorage,
  isExistsContainerInStorage,
  selectFolders,
  setSelected,
  openNewFolderDialog,
} from "./store/tableauSlice";

const useStyles = makeStyles((theme) => ({
  listItem: {
    color: "inherit!important",
    textDecoration: "none!important",
    height: 40,
    width: "calc(100% - 16px)",
    borderRadius: "0 20px 20px 0",
    paddingLeft: 24,
    paddingRight: 12,
    "&.active": {
      backgroundColor: theme.palette.secondary.main,
      color: `${theme.palette.secondary.contrastText}!important`,
      pointerEvents: "none",
      "& .list-item-icon": {
        color: "inherit",
      },
    },
    "& .list-item-icon": {
      fontSize: 16,
      width: 16,
      height: 16,
      marginRight: 16,
    },
  },
  listSubheader: {
    paddingLeft: 24,
  },
}));

function TableauSidebarContent(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const folders = useSelector(selectFolders);
  const selected = useSelector(({ tableauApp }) => tableauApp.folders.selected);
  const prefix = useSelector(({ tableauApp }) => tableauApp.folders.prefix);

  useEffect(() => {
    dispatch(listContainersInStorage());
  }, [dispatch]);

  useEffect(() => {
    if (folders.length > 0 && !selected) {
      dispatch(setSelected(folders[0].name));
    }
  }, [dispatch, folders, selected]);

  return (
    <FuseAnimate animation="transition.slideUpIn" delay={400}>
      <div className="flex-auto border-l-1 border-solid">
        <div className="p-24">
          <Button
            onClick={() => {
              dispatch(openNewFolderDialog());
            }}
            variant="contained"
            color="primary"
            className="w-full"
          >
            ADD FOLDER
          </Button>
        </div>

        <div className={classes.listWrapper}>
          <List>
            <ListSubheader className={classes.listSubheader} disableSticky>
              FOLDERS
            </ListSubheader>

            {folders.length > 0 &&
              folders.map((folder) => (
                <ListItem
                  button
                  className={classes.listItem}
                  key={folder.id}
                  onClick={() => dispatch(setSelected(folder.name))}
                >
                  <Icon className="list-item-icon" color="action">
                    folder
                  </Icon>
                  <ListItemText
                    primary={
                      folder.name && folder.name.substr(prefix.length + 1)
                    }
                    disableTypography
                  />

                  <Icon
                    className="list-item-icon"
                    color="action"
                    onClick={async () => {
                      const response = await dispatch(
                        isExistsContainerInStorage({ name: folder.name })
                      );
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
                            name: folder.name,
                          })
                        ).then(() => {});
                      }
                    }}
                  >
                    delete
                  </Icon>
                </ListItem>
              ))}
          </List>

          <List>
            <ListSubheader className={classes.listSubheader} disableSticky>
              TEMPLATES
            </ListSubheader>
            <ListItem
              button
              className={classes.listItem}
              onClick={() => dispatch(setSelected("tableau-templates"))}
            >
              <Icon className="list-item-icon" color="action">
                folder
              </Icon>
              <ListItemText primary={"templates"} disableTypography />
            </ListItem>
          </List>
        </div>
      </div>
    </FuseAnimate>
  );
}

export default TableauSidebarContent;
