import FuseAnimate from "@fuse/core/FuseAnimate";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useSelector } from "react-redux";

function TableauSidebarHeader() {
  const selected = useSelector(({ tableauApp }) => tableauApp.folders.selected);
  const prefix = useSelector(({ tableauApp }) => tableauApp.folders.prefix);

  return (
    <div className="flex flex-col justify-center h-full p-24">
      <div className="flex items-center flex-1">
        <FuseAnimate animation="transition.expandIn" delay={300}>
          <Icon className="text-32">elevator</Icon>
        </FuseAnimate>
        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
          <Typography className="text-16 sm:text-20 truncate">
            Tableau
          </Typography>
        </FuseAnimate>
      </div>
      <FuseAnimate animation="transition.slideUpIn" delay={300}>
        <Typography className="text-16 sm:text-20 truncate">
          {selected && selected.substr(prefix.length + 1)}
        </Typography>
      </FuseAnimate>
    </div>
  );
}

export default TableauSidebarHeader;
