export default async function handler(req, res) {
  const clientId = process.env.DB_CLIENT_ID;
  const apiKey = process.env.DB_API_KEY;

  if (!clientId || !apiKey) {
    res
      .status(500)
      .send("<error>Missing DB_CLIENT_ID or DB_API_KEY environment variables</error>");
    return;
  }

  const evaId = "8000207"; // Köln Hbf
  const now = new Date();
  const time = String(now.getHours()).padStart(2, "0") + "00";

  const url = `https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/plan/${evaId}/${time}`;

  try {
    const response = await fetch(url, {
      headers: {
        "DB-Client-Id": clientId,
        "DB-Api-Key": apiKey
      }
    });

    const text = await response.text();

    res.setHeader("Content-Type", "text/xml; charset=utf-8");
    res.status(response.ok ? 200 : response.status).send(text);
  } catch (err) {
    res.status(500).send(`<error>${err.message}</error>`);
  }
}
