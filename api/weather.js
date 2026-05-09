function calcHeatIndex(tempC, rh) {
  const T = tempC * 9 / 5 + 32;
  const H = rh;
  let HI =
    -42.379 + 2.04901523 * T + 10.14333127 * H
    - 0.22475541 * T * H - 0.00683783 * T * T
    - 0.05481717 * H * H + 0.00122874 * T * T * H
    + 0.00085282 * T * H * H - 0.00000199 * T * T * H * H;
  if (T < 80) HI = T;
  return Math.round((HI - 32) * 5 / 9 * 10) / 10;
}

function heatLevel(hiC) {
  if (hiC >= 54) return "Extreme danger";
  if (hiC >= 41) return "Danger";
  if (hiC >= 32) return "Extreme caution";
  if (hiC >= 27) return "Caution";
  return "Normal";
}

export default async function handler(req, res) {
  try {
    let lat = parseFloat(req.query.lat);
    let lon = parseFloat(req.query.lon);
    let city = req.query.city || null;

    if (isNaN(lat) || isNaN(lon)) {
      const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=lat,lon,city,regionName,country,status`);
      const geoData = await geoRes.json();
      if (geoData.status !== "success") throw new Error(`Geolocation failed for IP: ${ip}`);
      lat = geoData.lat; lon = geoData.lon;
      city = `${geoData.city}, ${geoData.regionName}, ${geoData.country}`;
    }

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&temperature_unit=celsius`
    );
    const weatherData = await weatherRes.json();
    const current = weatherData.current;

    const tempC = current.temperature_2m;
    const humidity = current.relative_humidity_2m;
    const heatIndex = calcHeatIndex(tempC, humidity);

    res.status(200).json({
      location: city || `${lat}, ${lon}`,
      coordinates: { lat, lon },
      temperature_c: tempC,
      humidity_pct: humidity,
      heat_index_c: heatIndex,
      heat_level: heatLevel(heatIndex)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
