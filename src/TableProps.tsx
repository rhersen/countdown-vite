import TrainAnnouncement from "./TrainAnnouncement";
import { SearchParams } from "./SearchParams";

export type TableProps = {
  locations: { [key: string]: string };
  announcements: TrainAnnouncement[];
  now: Date;
  fetch: (params: SearchParams) => void;
};
