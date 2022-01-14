import React from "react";
import TrainAnnouncement, { fromLocation } from "./TrainAnnouncement";

export default function DestinationCell({
  announcement,
  locations
}: {
  announcement: TrainAnnouncement;
  locations: { [key: string]: string };
}) {
  return (
    <td className="destination">
      <span className="from">{fromLocation(announcement, locations)}–</span>
      {announcement.ToLocation &&
        announcement.ToLocation.map(
          location => locations[location.LocationName]
        ).join()}
    </td>
  );
}
