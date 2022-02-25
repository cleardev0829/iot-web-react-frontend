import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeImageDialog } from "./store/dialogSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ImageDialog(props) {
  const dispatch = useDispatch();
  const resourceImage = useSelector(
    ({ tableauApp }) => tableauApp.dialog.resourceImage
  );

  return (
    <Dialog
      classes={{
        paper: "w-full m-24 rounded-8",
      }}
      TransitionComponent={Transition}
      onClose={(ev) => dispatch(closeImageDialog())}
      open={Boolean(resourceImage)}
    >
      <div className="flex flex-col w-full">
        <div className="w-full">
          {resourceImage && resourceImage !== "" && (
            <div className="relative">
              <img src={resourceImage} className="w-full block" alt="note" />
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}

export default ImageDialog;
