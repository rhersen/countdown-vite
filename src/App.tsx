import { useEffect, useState } from "react";
import "./App.css";
import { add, formatISO, sub } from "date-fns";
import Table from "./Table";
import { SearchParams } from "./SearchParams";
import TrainAnnouncement from "./TrainAnnouncement";

let intervalId: NodeJS.Timeout;

function queryString(params: SearchParams) {
  return params.location
    ? `?location=${params.location}`
    : `?train=${params.trainId}`;
}

function App() {
  const [locations, setLocations] = useState<Record<string, string>>({});
  const [announcements, setAnnouncements] = useState<TrainAnnouncement[]>([]);
  const [msg, setMsg] = useState("");
  const [now, setNow] = useState(new Date());
  const [eventSource, setEventSource] = useState<EventSource>();

  function button(location: string) {
    return (
      <button
        onClick={async () => {
          const response = await fetch(
            `/.netlify/functions/announcements?location=${location}`
          );
          const json = await response.json();
          if (json.msg) setMsg(json.msg);
          if (json.TrainAnnouncement) {
            setAnnouncements(json.TrainAnnouncement);
            setMsg("");
          }
        }}
      >
        {locations[location] ?? location}
      </button>
    );
  }

  useEffect(() => {
    async function componentDidMount() {
      intervalId = setInterval(() => setNow(new Date()), 990);
      const response = await fetch("/.netlify/functions/locations");
      setLocations(await response.json());
    }

    function componentWillUnmount() {
      clearInterval(intervalId);
    }

    componentDidMount();

    return componentWillUnmount;
  }, []);

  const since = formatISO(sub(new Date(), { hours: 2 })).substring(0, 19);
  const until = formatISO(add(new Date(), { hours: 2 })).substring(0, 19);

  return (
    <div>
      {button("Sub")}
      {button("Sod")}
      {button("Sci")}
      {button("Sst")}
      {button("Åbe")}
      {button("Äs")}
      {button("Sta")}
      {button("Hu")}
      {button("Flb")}
      {button("Tul")}
      {button("Tu")}
      <div>{msg}</div>
      <Table
        locations={locations}
        announcements={announcements}
        now={now}
        fetch={async (params: SearchParams) => {
          const rsp = await fetch(
            `/.netlify/functions/announcements${queryString(
              params
            )}&since=${since}&until=${until}`
          );
          const json = await rsp.json();

          if (json.INFO) {
            eventSource?.close();
            setEventSource(new EventSource(json.INFO.SSEURL));

            if (eventSource) {
              eventSource.onmessage = ({ data }: MessageEvent) => {
                const trainAnnouncement: TrainAnnouncement[] =
                  JSON.parse(data).RESPONSE.RESULT[0].TrainAnnouncement;
                {
                  const found = announcements.findIndex(
                    (announcement: TrainAnnouncement) =>
                      announcement.LocationSignature ===
                      trainAnnouncement[0].LocationSignature
                  );
                  if (found < 0) return;
                  return {
                    announcements: announcements
                      .slice(0, found)
                      .concat(
                        trainAnnouncement,
                        announcements.slice(found + 1)
                      ),
                  };
                }
              };
            }
          }
          if (json.msg) setMsg(json.msg);
          setAnnouncements(json.TrainAnnouncement);
          setMsg("");
        }}
      />{" "}
    </div>
  );
}

export default App;
