import { TableProps } from "./TableProps";
import TrainAnnouncement from "./TrainAnnouncement";
import StationRow from "./StationRow";
import { stationName } from "./Response";
import React from "react";

export default function StationTable(props: TableProps) {
  return (
    <table>
      <caption>
        {stationName(props.announcements, props.locations)}
      </caption>
      <tbody>
        {props.announcements.map((announcement: TrainAnnouncement) => {
          const trainId = announcement.AdvertisedTrainIdent;
          return (
            <StationRow
              key={trainId}
              onClick={() => props.fetch({ trainId })}
              announcement={announcement}
              locations={props.locations}
              now={props.now}
            />
          );
        })}
      </tbody>
    </table>
  );
}
