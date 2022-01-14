import React from "react";
import TrainAnnouncement, {shortText} from "./TrainAnnouncement";

export default function ShortCell(props: { announcement: TrainAnnouncement }) {
  return <td className="short">{shortText(props.announcement)}</td>;
}

