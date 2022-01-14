import Response from "./Response";
import { SearchParams } from "./SearchParams";

export type TableProps = {
  locations: { [key: string]: string };
  response: Response;
  now: Date;
  fetch: (params: SearchParams) => void;
};
