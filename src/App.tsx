import { Component } from "react";
import Response from "./Response";
import "./App.css";
import { add, formatISO, sub } from "date-fns";
import TrainAnnouncement from "./TrainAnnouncement";
import Table from "./Table";
import { SearchParams } from "./SearchParams";

let intervalId: NodeJS.Timeout;

type MyState = {
  locations: { [key: string]: string };
  response: Response;
  msg: string;
  now: Date;
};

class App extends Component {
  state: MyState = {
    locations: {},
    response: { announcements: [] },
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
    const stateUpdater =
      (newAnnouncement: TrainAnnouncement) => (oldState: MyState) => {
        const { announcements } = oldState.response;
        const found = announcements.findIndex(
          (oldAnnouncement: TrainAnnouncement) =>
            oldAnnouncement.LocationSignature ===
            newAnnouncement.LocationSignature
        );
        return {
          response: {
            announcements:
              found === -1
                ? announcements
                : [
                    ...announcements.slice(0, found),
                    newAnnouncement,
                    ...announcements.slice(found + 1),
                  ],
          },
        };
      };

    function queryString(params: SearchParams) {
      return params.location
        ? `?location=${params.location}`
        : `?train=${params.trainId}`;
    }

    const since = formatISO(sub(new Date(), { hours: 2 })).substr(0, 19);
    const until = formatISO(add(new Date(), { hours: 2 })).substr(0, 19);
    const { msg, response, now, locations } = this.state;

    return (
      <div>
        {this.button("Sub")}
        {this.button("Sod")}
        {this.button("Sci")}
        {this.button("Sst")}
        {this.button("??be")}
        {this.button("??s")}
        {this.button("Sta")}
        {this.button("Hu")}
        {this.button("Flb")}
        {this.button("Tul")}
        {this.button("Tu")}
        <div>{msg}</div>
        <Table
          locations={locations}
          response={response}
          now={now}
          fetch={async (params: SearchParams) => {
            const rsp = await fetch(
              `/.netlify/functions/announcements${queryString(
                params
              )}&since=${since}&until=${until}`
            );
            const json = await rsp.json();
            if (json.msg) this.setState({ msg: json.msg });
            this.setAnnouncements(json.TrainAnnouncement);

            function getAnnouncements(data: string): TrainAnnouncement {
              return JSON.parse(data).RESPONSE.RESULT[0].TrainAnnouncement[0];
            }
          }}
        />
      </div>
    );
  }

  private setAnnouncements(announcements: Array<TrainAnnouncement>) {
    if (announcements)
      this.setState({
        response: { announcements },
        msg: "",
      });
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
              response: { announcements: json.TrainAnnouncement },
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
