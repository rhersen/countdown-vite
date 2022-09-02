import React from "react";
import { train } from "./Response";
import { TableProps } from "./TableProps";
import TrainRow from "./TrainRow";

export default function TrainTable(props: TableProps) {
  const { announcements, locations, now, fetch } = props;
  const t = train(announcements);
  return (
    <table>
      {t ? (
        <caption>
          {t.TypeOfTraffic.Description} {t.AdvertisedTrainIdent} till{" "}
          {t.ToLocation.map((l) => locations[l.LocationName]).join()}
        </caption>
      ) : null}
      <tbody>
        {announcements.map((announcement) => {
          const location = announcement.LocationSignature;
          return (
            <TrainRow
              key={location}
              onClick={() => fetch({ location })}
              announcement={announcement}
              locations={locations}
              now={now}
            />
          );
        })}
      </tbody>
    </table>
  );
}
