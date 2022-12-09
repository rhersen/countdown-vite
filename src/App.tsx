import { Component } from "react";
import "./App.css";
import { add, formatISO, sub } from "date-fns";
import TrainAnnouncement from "./TrainAnnouncement";
import Table from "./Table";
import { SearchParams } from "./SearchParams";

let intervalId: NodeJS.Timeout;

type MyState = {
  locations: { [key: string]: string };
  announcements: TrainAnnouncement[];
  msg: string;
  now: Date;
  eventSource?: EventSource;
};

class App extends Component {
  state: MyState = {
    locations: {},
    announcements: [],
    msg: "",
    now: new Date(),
  };

  async componentDidMount() {
    intervalId = setInterval(() => this.setState({ now: new Date() }), 990);
    const response = await fetch("/.netlify/functions/locations");
    this.setState({ locations: await response.json() });
  }

  componentWillUnmount() {
    clearInterval(intervalId);
  }

  render() {
    function queryString(params: SearchParams) {
      return params.location
        ? `?location=${params.location}`
        : `?train=${params.trainId}`;
    }

    const since = formatISO(sub(new Date(), { hours: 2 })).substring(0, 19);
    const until = formatISO(add(new Date(), { hours: 2 })).substring(0, 19);
    const { msg, announcements, now, locations } = this.state;

    return (
      <div>
        {this.button("Mr")}
        {this.button("So")}
        {this.button("Sub")}
        {this.button("Sod")}
        {this.button("Sci")}
        {this.button("Sst")}
        {this.button("Åbe")}
        {this.button("Äs")}
        {this.button("Hu")}
        {this.button("Flb")}
        {this.button("Tul")}
        {this.button("Tu")}
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
              this.state.eventSource?.close();
              const eventSource = new EventSource(json.INFO.SSEURL);
              const self = this;
              eventSource.onmessage = ({ data }: MessageEvent) => {
                const trainAnnouncement: TrainAnnouncement[] =
                  JSON.parse(data).RESPONSE.RESULT[0].TrainAnnouncement;
                self.setState(({ announcements }: MyState) => {
                  const found = announcements.findIndex(
                    (announcement) =>
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
                });
              };
              this.setState({ eventSource });
            }
            if (json.msg) this.setState({ msg: json.msg });
            this.setAnnouncements(json.TrainAnnouncement);
          }}
        />
      </div>
    );
  }

  private setAnnouncements(announcements: Array<TrainAnnouncement>) {
    if (announcements) this.setState({ announcements, msg: "" });
  }

  button(location: string) {
    return (
      <button
        onClick={async () => {
          const response = await fetch(
            `/.netlify/functions/announcements?location=${location}`
          );
          const json = await response.json();
          if (json.msg) this.setState({ msg: json.msg });
          if (json.TrainAnnouncement)
            this.setState({
              announcements: json.TrainAnnouncement,
              msg: "",
            });
        }}
      >
        {this.state.locations[location]}
      </button>
    );
  }
}

export default App;
