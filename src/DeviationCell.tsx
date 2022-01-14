import React from "react";
import TrainAnnouncement, {deviationText} from "./TrainAnnouncement";

export default function DeviationCell(props: {
  announcement: TrainAnnouncement;
}) {
  return (
    <td className="deviation">{deviationText(props.announcement).map(div)}</td>
  );
}

function div(c: string): JSX.Element {
  return <div key={c}>{c}</div>;
}
