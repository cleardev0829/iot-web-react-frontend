import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import FusePageCarded from "@fuse/core/FusePageCarded";
import { useForm, useDeepCompareEffect } from "@fuse/hooks";
import FuseUtils from "@fuse/utils";
import { grey } from "@material-ui/core/colors";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import withReducer from "app/store/withReducer";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetResource,
  deleteFile,
  uploadFile,
  getBlobFiles,
} from "./store/resourcesSlice";
import { openImageDialog } from "./store/dialogSlice";
import reducer from "./store";
import ImageDialog from "./ImageDialog";

const useStyles = makeStyles((theme) => ({
  resourceImageFeaturedStar: {
    position: "absolute",
    top: 0,
    right: 0,
    color: grey[400],
    opacity: 0,
  },
  resourceImageUpload: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },
  resourceImageItem: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    "&:hover": {
      "& $resourceImageFeaturedStar": {
        opacity: 0.8,
      },
    },
    "&.featured": {
      // pointerEvents: "none",
      boxShadow: theme.shadows[3],
      "& $resourceImageFeaturedStar": {
        opacity: 1,
      },
      "&:hover $resourceImageFeaturedStar": {
        opacity: 1,
      },
    },
  },
}));

const CONTAINERS = [
  "mt42",
  "rt42",
  "displays",
  "engravings",
  "others",
  "templates",
];

function Resource(props) {
  const dispatch = useDispatch();
  const resource = useSelector(({ tableauApp }) => tableauApp.resource);

  const classes = useStyles(props);
  const [tabValue, setTabValue] = useState(0);

  const { form, setForm } = useForm(null);

  useDeepCompareEffect(() => {
    function updateResourceState() {
      dispatch(
        getBlobFiles({ containerName: `tableau-${CONTAINERS[tabValue]}` })
      );
    }

    updateResourceState();
  }, [dispatch, tabValue]);

  useEffect(() => {
    if ((resource && !form) || (resource && form && resource.id !== form.id)) {
      setForm(resource);
    }
  }, [form, resource, setForm]);

  useEffect(() => {
    return () => {
      dispatch(resetResource());
    };
  }, [dispatch]);

  function handleChangeTab(event, value) {
    setTabValue(value);
  }

  function handleUploadChange(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const blob = file.slice(0, file.size, file.type);
    const uid = FuseUtils.generateGUID();
    const newFile = new File([blob], `${uid}-${file.name}`, {
      type: file.type,
    });

    dispatch(
      uploadFile({
        containerName: `tableau-${CONTAINERS[tabValue]}`,
        file: newFile,
      })
    );
  }

  if (!resource) {
    return <FuseLoading />;
  }

  return (
    <>
      <FusePageCarded
        classes={{
          toolbar: "p-0",
          header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        }}
        header={
          form && (
            <div className="flex flex-1 w-full items-center justify-between">
              <div className="flex flex-col items-start max-w-full">
                <div className="flex items-center max-w-full">
                  <FuseAnimate animation="transition.expandIn" delay={300}>
                    <Icon className="text-32">elevator</Icon>
                  </FuseAnimate>
                  <div className="flex flex-col min-w-0 mx-8 sm:mc-16">
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography className="text-16 sm:text-20 truncate">
                        Tableau
                      </Typography>
                    </FuseAnimate>
                  </div>
                </div>
              </div>
              {/* <div>
              <FuseAnimate animation="transition.slideRightIn" delay={300}>
                <Button
                  className="whitespace-nowrap mx-4"
                  variant="contained"
                  color="secondary"
                  disabled={!selected}
                  onClick={() =>
                    dispatch(
                      deleteFile({
                        ...selected,
                        containerName: `tableau-${CONTAINERS[tabValue]}`,
                      })
                    )
                  }
                  startIcon={<Icon className="hidden sm:flex">delete</Icon>}
                >
                  Remove
                </Button>
              </FuseAnimate>             
            </div> */}
            </div>
          )
        }
        contentToolbar={
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ root: "w-full h-64" }}
          >
            <Tab className="h-64 normal-case" label="mt42" />
            <Tab className="h-64 normal-case" label="rt42" />
            <Tab className="h-64 normal-case" label="displays" />
            <Tab className="h-64 normal-case" label="engravings" />
            <Tab className="h-64 normal-case" label="others" />
            {/* <Tab className="h-64 normal-case" label="templates" /> */}
          </Tabs>
        }
        content={
          <div className="p-16 sm:p-24 max-w-2xl">
            <div>
              <div className="flex justify-center sm:justify-start flex-wrap -mx-8">
                {tabValue < 5 && (
                  <label
                    htmlFor="button-file"
                    className={clsx(
                      classes.resourceImageUpload,
                      "flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                    )}
                  >
                    <input
                      accept="image/*"
                      className="hidden"
                      id="button-file"
                      type="file"
                      onChange={handleUploadChange}
                    />
                    <Icon fontSize="large" color="action">
                      cloud_upload
                    </Icon>
                  </label>
                )}
                {form &&
                  form.images.map((media) => (
                    <div
                      // onClick={() => {
                      //   setSelected(media);
                      //   setFeaturedImage(media.id);
                      // }}
                      // onKeyDown={() => setFeaturedImage(media.id)}
                      role="button"
                      tabIndex={0}
                      className={clsx(
                        classes.resourceImageItem,
                        "flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow hover:shadow-lg",
                        media.id === form.featuredImageId && "featured"
                      )}
                      key={media.id}
                    >
                      <Icon
                        onClick={() => {
                          dispatch(
                            deleteFile({
                              containerName: `tableau-${CONTAINERS[tabValue]}`,
                              fileName: media.name,
                            })
                          );
                        }}
                        className={classes.resourceImageFeaturedStar}
                      >
                        delete
                      </Icon>
                      <img
                        className="max-w-none w-auto h-full"
                        src={media.url}
                        onClick={() => dispatch(openImageDialog(media.url))}
                        alt="resource"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        }
        innerScroll
      />
      <ImageDialog />
    </>
  );
}

export default withReducer("tableauApp", reducer)(Resource);
