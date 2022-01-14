import React from "react";
import TrainAnnouncement from "./TrainAnnouncement";

export default function TrainIdCell(props: { announcement: TrainAnnouncement }) {
  return <td className="id">{props.announcement.AdvertisedTrainIdent}</td>;
}
