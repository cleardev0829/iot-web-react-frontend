import FuseLoading from "@fuse/core/FuseLoading";
import FusePageCarded from "@fuse/core/FusePageCarded";
import { useForm, useDeepCompareEffect } from "@fuse/hooks";
import FuseUtils from "@fuse/utils";
import { grey } from "@material-ui/core/colors";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import withReducer from "app/store/withReducer";
import clsx from "clsx";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBlobsInContainer,
  deleteBlobInContainer,
  uploadBlobInContainer,
  resetResource,
} from "./store/tableauSlice";
import { openImageDialog } from "./store/dialogSlice";
import reducer from "./store";
import ImageDialog from "./ImageDialog";
import FolderDialog from "./FolderDialog";
import TableauSidebarContent from "./TableauSidebarContent";
import TableauSidebarHeader from "./TableauSidebarHeader";

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

function Resource(props) {
  const dispatch = useDispatch();
  const resource = useSelector(({ tableauApp }) => tableauApp.folders.resource);
  const selected = useSelector(({ tableauApp }) => tableauApp.folders.selected);
  const prefix = useSelector(({ tableauApp }) => tableauApp.folders.prefix);

  const classes = useStyles(props);
  const { form, setForm } = useForm(null);

  useDeepCompareEffect(() => {
    function updateResourceState() {
      dispatch(getBlobsInContainer({ ...form, name: selected }));
    }

    updateResourceState();
  }, [dispatch, selected]);

  useEffect(() => {
    setForm(resource);
  }, [form, resource, setForm]);

  useEffect(() => {
    return () => {
      dispatch(resetResource());
    };
  }, [dispatch]);

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
      uploadBlobInContainer({
        containerName: selected,
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
        content={
          <div className="p-16 sm:p-24 max-w-2xl">
            <div>
              <div className="flex justify-center sm:justify-start flex-wrap -mx-8">
                {selected && selected !== "tableau-templates" && (
                  <label
                    htmlFor="button-file"
                    className={clsx(
                      classes.resourceImageUpload,
                      "flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                    )}
                  >
                    <input
                      accept=".png"
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
                  form.map((media) => (
                    <div
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
                            deleteBlobInContainer({
                              containerName: selected,
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
        leftSidebarHeader={<TableauSidebarHeader />}
        leftSidebarContent={<TableauSidebarContent />}
        innerScroll
      />
      <ImageDialog />
      <FolderDialog />
    </>
  );
}

export default withReducer("tableauApp", reducer)(Resource);
