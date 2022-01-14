const fetch = require("node-fetch");
exports.handler = async function({ queryStringParameters }) {
  try {
    const response = await fetch(
      "https://api.trafikinfo.trafikverket.se/v2/data.json",
      {
        method: "POST",
        body: getBody(queryStringParameters),
        headers: {
          "Content-Type": "application/xml",
          Accept: "application/json"
        }
      }
    );
    if (!response.ok)
      // NOT res.status >= 200 && res.status < 300
      return {
        statusCode: response.status,
        body: JSON.stringify({ msg: response.statusText })
      };

    const data = await response.json();
    const [body] = data.RESPONSE.RESULT;

    return {
      statusCode: 200,
      body: JSON.stringify(body)
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
};

function getBody({ location, train, since, until }) {
  if (location) return getLocationBody(location);
  if (train) return getTrainBody(train, since, until);
}

function getLocationBody(location) {
  return `
<REQUEST>
  <LOGIN authenticationkey='${process.env.TRAFIKVERKET_API_KEY}' />
     <QUERY objecttype='TrainAnnouncement' orderby='AdvertisedTimeAtLocation' schemaversion='1.6'>
      <FILTER>
         <AND>
            <NE name='Canceled' value='true' />
            <EQ name='Advertised' value='true' />
            <EQ name='ActivityType' value='Avgang' />
            <EQ name='LocationSignature' value='${location}' />
            <OR>
               <GT name='AdvertisedTimeAtLocation' value='$dateadd(-0:15:00)' />
               <GT name='EstimatedTimeAtLocation' value='$dateadd(-0:15:00)' />
            </OR>
            <LT name='AdvertisedTimeAtLocation' value='$dateadd(2:00:00)' />
         </AND>
      </FILTER>
     </QUERY>
</REQUEST>`;
}

function getTrainBody(train, since, until) {
  return `
<REQUEST>
  <LOGIN authenticationkey='${process.env.TRAFIKVERKET_API_KEY}' />
    <QUERY sseurl='true' objecttype='TrainAnnouncement' orderby='AdvertisedTimeAtLocation' schemaversion='1.6'>
      <FILTER>
        <NE name='Canceled' value='true' />
        <EQ name='ActivityType' value='Avgang' />
        <EQ name='AdvertisedTrainIdent' value='${train}' />
        <GT name='AdvertisedTimeAtLocation' value='${since}'/>
        <LT name='AdvertisedTimeAtLocation' value='${until}'/>
      </FILTER>
    </QUERY>
</REQUEST>`;
}
