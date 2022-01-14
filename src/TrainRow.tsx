import TrainAnnouncement from "./TrainAnnouncement";
import TrainIdCell from "./TrainIdCell";
import TrackCell from "./TrackCell";
import ShortCell from "./ShortCell";
import LocationCell from "./LocationCell";
import AdvertisedTimeCell from "./AdvertisedTimeCell";
import TimeCell from "./TimeCell";
import CountdownCell from "./CountdownCell";
import DeviationCell from "./DeviationCell";
import React from "react";
import { DelayCell } from "./DelayCell";

export default function TrainRow(props: {
  onClick: () => void;
  announcement: TrainAnnouncement;
  locations: { [key: string]: string };
  now: Date;
}) {
  return (
    <tr className="train" onClick={props.onClick}>
      <TrainIdCell announcement={props.announcement} />
      <TrackCell announcement={props.announcement} />
      <ShortCell announcement={props.announcement} />
      <LocationCell
        announcement={props.announcement}
        locations={props.locations}
      />
      <AdvertisedTimeCell announcement={props.announcement} />
      <TimeCell announcement={props.announcement} />
      <DelayCell announcement={props.announcement} />
      <CountdownCell announcement={props.announcement} now={props.now} />
      <DeviationCell announcement={props.announcement} />
    </tr>
  );
}
