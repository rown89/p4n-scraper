import fs, { promises } from 'fs';

const launchConversion = async () => {
  const sqlDump = await JSON.parse(await promises.readFile('places.json', 'utf-8'));

  const geoJSON = sqlDump.map((item, i) => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [Number(item.longitude) || 0, Number(item.latitude) || 0],
      },
      properties: {
        title: item.title || '',
        place_id: item.place_id || null,
        code: item.code || null,
      },
    };
  });

  await promises.writeFile('file.geojson', JSON.stringify(geoJSON, null, 1));
};

launchConversion();
