import TrainAnnouncement from "./TrainAnnouncement";

export default interface Response {
  announcements: Array<TrainAnnouncement>;
}

export function stationCount(announcements: TrainAnnouncement[]): number {
  if (!announcements) return 0;

  const signatures: { [key: string]: Boolean } = {};
  announcements.forEach(
    (announcement) => (signatures[announcement.LocationSignature] = true)
  );

  return Object.keys(signatures).length;
}

export function stationName(
  announcements: TrainAnnouncement[],
  locations: { [key: string]: string }
) {
  return (
    announcements &&
    announcements.length > 0 &&
    locations[announcements[0].LocationSignature]
  );
}

export function train(
  announcements: TrainAnnouncement[]
): TrainAnnouncement | undefined {
  return announcements.find((announcement) => announcement.TypeOfTraffic);
}
