import { addSeconds, differenceInSeconds, format, parseISO } from "date-fns";

export default interface TrainAnnouncement {
  ActivityId: string;
  ActivityType: string;
  Advertised: boolean;
  AdvertisedTimeAtLocation: string;
  AdvertisedTrainIdent: string;
  Canceled: boolean;
  Deviation: Description[];
  EstimatedTimeAtLocation: string;
  EstimatedTimeIsPreliminary: boolean;
  FromLocation: Location[];
  InformationOwner: string;
  LocationSignature: string;
  ModifiedTime: string;
  NewEquipment: number;
  OtherInformation: Description[];
  ProductInformation: Description[];
  ScheduledDepartureDateTime: string;
  TechnicalTrainIdent: string;
  TimeAtLocation: string;
  TimeAtLocationWithSeconds: string;
  ToLocation: Location[];
  TrackAtLocation: string;
  TypeOfTraffic: Description;
  ViaToLocation: Location[];
  WebLink: string;
}

interface Location {
  LocationName: string;
  Priority: number;
  Order: number;
}

interface Description {
  Code: string;
  Description: string;
}

export function time(announcement: TrainAnnouncement) {
  return hmm(announcement.AdvertisedTimeAtLocation);

  function hmm(advertised: string) {
    const parsed = parseISO(advertised);
    return format(parsed, parsed.getSeconds() ? "H:mm:ss" : "H:mm");
  }
}

// eslint-disable-next-line complexity
export function countdown(announcement: TrainAnnouncement, now: Date) {
  if (!now) return "";

  const dateLeft: string =
    announcement.TimeAtLocationWithSeconds ||
    announcement.EstimatedTimeAtLocation ||
    announcement.AdvertisedTimeAtLocation;
  const seconds = differenceInSeconds(parseISO(dateLeft), now);

  if (seconds <= -100) return "";
  if (seconds >= 600)
    return `${format(addSeconds(new Date(0), seconds), "m")}min`;
  if (seconds >= 100) return format(addSeconds(new Date(0), seconds), "m:ss");
  return `${seconds}s`;
}

export function fromLocation(
  announcement: TrainAnnouncement,
  locations: { [key: string]: string }
) {
  return (
    announcement.FromLocation &&
    announcement.FromLocation.map(
      location => locations[location.LocationName]
    ).join()
  );
}

export function directionClass(announcement: TrainAnnouncement) {
  return /\d+[24680]$/.test(announcement.AdvertisedTrainIdent)
    ? "northbound"
    : "southbound";
}

export function shortText(announcement: TrainAnnouncement): string {
  const deviations: string[] = (announcement.Deviation || []).map(descriptions);

  return deviations
    ? deviations
        .map(s => {
          if (/Kort/.test(s)) return "K";
          if (s.length) return "*";
          return s;
        })
        .join()
    : "";
}

export function deviationText(announcement: TrainAnnouncement): string[] {
  return (announcement.Deviation || [])
    .map(descriptions)
    .filter(s => !/Kort/.test(s));
}

function descriptions(deviation: Description): string {
  return deviation.Description;
}
