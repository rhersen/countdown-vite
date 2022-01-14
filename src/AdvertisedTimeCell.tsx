import React from "react";
import TrainAnnouncement, { time } from "./TrainAnnouncement";

export default function AdvertisedTimeCell(props: {
  announcement: TrainAnnouncement;
}) {
  return <td className="advertised">{time(props.announcement)}</td>;
}
