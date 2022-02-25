import React from "react";

const TableauAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/apps/tableau",
      component: React.lazy(() => import("./Tableau")),
    },
  ],
};

export default TableauAppConfig;
