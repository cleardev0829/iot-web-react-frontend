import _ from "@lodash";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FuseLoading from "@fuse/core/FuseLoading";
import FuseAnimate from "@fuse/core/FuseAnimate/FuseAnimate";
import { getMessages, selectMessages } from "../../store/messagesSlice";
import { getDuration } from "app/utils/Functions";

function Component(props) {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const counter = useSelector(({ productApp }) => productApp.refresh.counter);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const routeParams = useParams([]);

  useEffect(() => {
    setLoading(true);

    dispatch(
      getMessages({
        deviceId: routeParams.deviceId,
        limit: 1,
        skip: 0,
        log: "stats",
      })
    ).then(() => setLoading(false));
  }, [dispatch, routeParams, counter]);

  useEffect(() => {
    console.log("Stats=>", _.orderBy(messages, ["timestamp"], ["desc"]));

    setData(_.orderBy(messages, ["timestamp"], ["desc"]));
  }, [messages]);

  if (loading) {
    return <FuseLoading />;
  }

  if (data.length === 0) {
    return (
      <FuseAnimate delay={100}>
        <div className="flex flex-1 items-center justify-center h-full">
          <Typography color="textSecondary" variant="h5">
            There are no data!
          </Typography>
        </div>
      </FuseAnimate>
    );
  }

  return (
    <div className="w-full flex flex-row justify-between">
      <div className="w-1/2 p-16 sm:p-24">
        <div>
          <TextField
            className="mt-8 mb-16"
            label="Max Trips"
            autoFocus
            id="trips"
            name="trips"
            value={data[0]["0"].maxTrips}
            variant="outlined"
            fullWidth
            inputProps={{
              readOnly: true,
            }}
          />

          <TextField
            className="mt-8 mb-16"
            label="Max Trips without a error"
            id="tripsWithoutErrors"
            name="natripsWithoutErrorsme"
            value={data[0]["0"].maxTripsWithoutErrors}
            variant="outlined"
            fullWidth
            inputProps={{
              readOnly: true,
            }}
          />

          <TextField
            className="mt-8 mb-16"
            label="Max Operating hours"
            id="operating hours"
            name="operating hours"
            value={getDuration(data[0]["0"].maxOperatingHours)}
            variant="outlined"
            fullWidth
            inputProps={{
              readOnly: true,
            }}
          />

          <TextField
            className="mt-8 mb-16"
            label="Count"
            id="count"
            name="count"
            value={data[0].count}
            variant="outlined"
            fullWidth
            inputProps={{
              readOnly: true,
            }}
          />

          <TextField
            className="mt-8 mb-16"
            label="Time"
            id="time"
            name="time"
            value={moment(new Date(data[0].timestamp)).format(
              "YYYY-MM-DD hh:mm:ss a"
            )}
            variant="outlined"
            fullWidth
            inputProps={{
              readOnly: true,
            }}
          />
        </div>
      </div>

      <div className="w-1/2 p-16 sm:p-24">
        <div>
          <TextField
            className="mt-8 mb-16"
            label="Trips"
            autoFocus
            id="trips"
            name="trips"
            value={data[0].message.trips}
            variant="outlined"
            fullWidth
            inputProps={{
              readOnly: true,
            }}
          />

          <TextField
            className="mt-8 mb-16"
            label="Trips without a error"
            id="tripsWithoutErrors"
            name="natripsWithoutErrorsme"
            value={data[0].message.tripsWithoutErrors}
            variant="outlined"
            fullWidth
            inputProps={{
              readOnly: true,
            }}
          />

          <TextField
            className="mt-8 mb-16"
            label="Operating hours"
            id="operating hours"
            name="operating hours"
            value={getDuration(data[0].message["operating hours"])}
            variant="outlined"
            fullWidth
            inputProps={{
              readOnly: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Component;
