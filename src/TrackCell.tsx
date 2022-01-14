import React from "react";
import TrainAnnouncement from "./TrainAnnouncement";

export default function TrackCell(props: { announcement: TrainAnnouncement }) {
  return <td className="track">{props.announcement.TrackAtLocation}</td>;
}
