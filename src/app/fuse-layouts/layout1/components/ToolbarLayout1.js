import FuseShortcuts from "@fuse/core/FuseShortcuts";
import AppBar from "@material-ui/core/AppBar";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import ChatPanelToggleButton from "app/fuse-layouts/shared-components/chatPanel/ChatPanelToggleButton";
import NavbarMobileToggleButton from "app/fuse-layouts/shared-components/NavbarMobileToggleButton";
import UserMenu from "app/fuse-layouts/shared-components/UserMenu";
import clsx from "clsx";
import React from "react";
import { useSelector } from "react-redux";
import { selectToolbarTheme } from "app/store/fuse/settingsSlice";
import FullScreenToggle from "../../shared-components/FullScreenToggle";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

function ToolbarLayout1(props) {
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const toolbarTheme = useSelector(selectToolbarTheme);

  const classes = useStyles(props);

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar
        id="fuse-toolbar"
        className={clsx(classes.root, "flex relative z-10 shadow-md")}
        color="default"
        style={{ backgroundColor: toolbarTheme.palette.background.paper }}
      >
        <Toolbar className="p-0 min-h-48 md:min-h-64">
          {config.navbar.display && config.navbar.position === "left" && (
            <Hidden lgUp>
              <NavbarMobileToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
            </Hidden>
          )}

          <div className="flex flex-1">
            <Hidden mdDown>
              <FuseShortcuts className="px-16" />
            </Hidden>
          </div>

          <div className="flex items-center px-8">
            {/* <LanguageSwitcher /> */}

            <Tooltip title="Tableau design editor" placement="bottom">
              <IconButton
                className={clsx("w-40 h-40", props.className)}
                component="a"
                href="https://rocket-tableau-design.netlify.app"
                target="_blank"
              >
                <Icon>{"add_to_home_screen"}</Icon>
              </IconButton>
            </Tooltip>

            <FullScreenToggle />

            {/* <FuseSearch /> */}

            <Hidden lgUp>
              <ChatPanelToggleButton />
            </Hidden>

            {/* <QuickPanelToggleButton /> */}

            <UserMenu />
          </div>

          {config.navbar.display && config.navbar.position === "right" && (
            <Hidden lgUp>
              <NavbarMobileToggleButton />
            </Hidden>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default React.memo(ToolbarLayout1);
