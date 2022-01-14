import TrainAnnouncement, { directionClass } from "./TrainAnnouncement";
import TrainIdCell from "./TrainIdCell";
import TrackCell from "./TrackCell";
import ShortCell from "./ShortCell";
import DestinationCell from "./DestinationCell";
import AdvertisedTimeCell from "./AdvertisedTimeCell";
import TimeCell from "./TimeCell";
import CountdownCell from "./CountdownCell";
import DeviationCell from "./DeviationCell";
import React from "react";
import { DelayCell } from "./DelayCell";

export default function StationRow({
  announcement,
  locations,
  onClick,
  now
}: {
  locations: { [key: string]: string };
  onClick: () => void;
  announcement: TrainAnnouncement;
  now: Date;
}) {
  return (
    <tr className={`station ${directionClass(announcement)}`} onClick={onClick}>
      <TrainIdCell announcement={announcement} />
      <TrackCell announcement={announcement} />
      <ShortCell announcement={announcement} />
      <DestinationCell announcement={announcement} locations={locations} />
      <AdvertisedTimeCell announcement={announcement} />
      <TimeCell announcement={announcement} />
      <DelayCell announcement={announcement} />
      <CountdownCell announcement={announcement} now={now} />
      <DeviationCell announcement={announcement} />
    </tr>
  );
}
