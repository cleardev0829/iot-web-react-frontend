import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";
import moment from "moment";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { green } from "@material-ui/core/colors";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FuseLoading from "@fuse/core/FuseLoading";
import FuseAnimate from "@fuse/core/FuseAnimate/FuseAnimate";
import { openMessageInfoDialog } from "../../store/dialogSlice";
import { getMessages, selectMessages } from "../../store/messagesSlice";
import { openNewNoteDialog, openEditNoteDialog } from "../../store/noteSlice";
import { getServicers } from "../../store/servicersSlice";
import MessageTableHead from "./MessageTableHead";
import MessageDialog from "./MessageDialog";
import { diff } from "app/utils/Functions";
import { MD_ROW_HEIGHT, ROWS_PER_PAGE } from "app/utils/Globals";

function Component(props) {
  const dispatch = useDispatch();
  const routeParams = useParams([]);
  const messages = useSelector(selectMessages);
  const searchText = useSelector(
    ({ productApp }) => productApp.messages.searchText
  );
  const counter = useSelector(({ productApp }) => productApp.refresh.counter);

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });

  useEffect(() => {
    setPage(0);
  }, [searchText, counter]);

  useEffect(() => {
    setLoading(true);

    dispatch(getServicers());
    dispatch(
      getMessages({
        deviceId: routeParams.deviceId,
        limit: rowsPerPage,
        skip: page * rowsPerPage,
        log: searchText.toLowerCase(),
      })
    ).then(() => setLoading(false));
  }, [dispatch, routeParams, searchText, page, rowsPerPage, counter]);

  useEffect(() => {
    setData(_.orderBy(messages, ["timestamp"], ["desc"]));
  }, [messages]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = "desc";

    if (order.id === property && order.direction === "desc") {
      direction = "asc";
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map((n) => n.id));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  function handleCheck(event, id) {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  if (loading) {
    return <FuseLoading />;
  }

  if (data.length === 0) {
    return (
      <FuseAnimate delay={100}>
        <div className="flex flex-1 items-center justify-center h-full">
          <Typography color="textSecondary" variant="h5">
            There are no messages!
          </Typography>
        </div>
      </FuseAnimate>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <FuseScrollbars className="flex-grow overflow-x-auto">
        <Table stickyHeader className="" aria-labelledby="tableTitle">
          <MessageTableHead
            selectedProductIds={selected}
            order={order}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            onMenuItemClick={handleDeselect}
            params={{
              deviceId: routeParams.deviceId,
              limit: rowsPerPage,
              skip: page * rowsPerPage,
              log: searchText.toLowerCase(),
            }}
          />

          <TableBody>
            {_.orderBy(
              data,
              [
                (o) => {
                  switch (order.id) {
                    default: {
                      return o[order.id];
                    }
                  }
                },
              ],
              [order.direction]
            )
              // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((n, i) => {
                const isSelected = selected.indexOf(n.id) !== -1;
                return (
                  <TableRow
                    className={`h-${MD_ROW_HEIGHT} cursor-pointer ${
                      n.log === "error" && "bg-red-50"
                    }`}
                    hover
                    tabIndex={-1}
                    key={n.id}
                  >
                    <TableCell
                      className="w-40 md:w-64 text-center"
                      padding="none"
                    >
                      <Checkbox
                        checked={isSelected}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => handleCheck(event, n.id)}
                      />
                    </TableCell>

                    <TableCell
                      onClick={() => dispatch(openMessageInfoDialog(n))}
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      {i + 1}
                    </TableCell>

                    <TableCell
                      onClick={() => dispatch(openMessageInfoDialog(n))}
                      className="p-4 md:p-16 truncate"
                      component="th"
                      scope="row"
                    >
                      {diff(moment(), n.timestamp)}
                    </TableCell>

                    <TableCell
                      onClick={() => dispatch(openMessageInfoDialog(n))}
                      className="p-4 md:p-16 truncate"
                      component="th"
                      scope="row"
                    >
                      {n.log}
                    </TableCell>

                    <TableCell
                      onClick={() => dispatch(openMessageInfoDialog(n))}
                      className="p-4 md:p-16 truncate"
                      component="th"
                      scope="row"
                    >
                      {n.number}
                    </TableCell>

                    <TableCell
                      onClick={() => dispatch(openMessageInfoDialog(n))}
                      className="p-4 md:p-16 truncate"
                      component="th"
                      scope="row"
                    >
                      {n.description}
                    </TableCell>

                    <TableCell
                      className="w-52 px-4 md:px-16 truncate"
                      component="th"
                      scope="row"
                      align="right"
                      padding="none"
                    >
                      {n.log === "error" && (
                        <IconButton
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            n.isNotes
                              ? dispatch(
                                  openEditNoteDialog({
                                    messageId: n.id,
                                    ...n.notes,
                                  })
                                )
                              : dispatch(
                                  openNewNoteDialog({
                                    messageId: n.id,
                                    ...n.notes,
                                  })
                                );
                          }}
                        >
                          {n.isNotes ? (
                            <Icon style={{ color: green[500] }}>comment</Icon>
                          ) : (
                            <Icon>comment</Icon>
                          )}
                        </IconButton>
                      )}
                    </TableCell>

                    <TableCell
                      className="w-52 px-4 md:px-16 truncate"
                      component="th"
                      scope="row"
                      align="right"
                      padding="none"
                    >
                      {n.log === "error" && <MessageDialog {...n} />}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        className="flex-shrink-0 border-t-1"
        component="div"
        count={data.length > 0 ? parseInt(data[0].count) : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        rowsPerPageOptions={[10, 25, 50, 100, 500]}
        backIconButtonProps={{
          "aria-label": "Previous Page",
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page",
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default Component;
