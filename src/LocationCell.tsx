import React from "react";
import TrainAnnouncement from "./TrainAnnouncement";

export default function LocationCell(props: {
  announcement: TrainAnnouncement;
  locations: { [key: string]: string };
}) {
  return (
    <td className="destination">
      {props.locations[props.announcement.LocationSignature]}
    </td>
  );
}
