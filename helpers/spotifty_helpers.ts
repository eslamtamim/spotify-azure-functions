async function fetchWebApi(endpoint: string, method: string, body: any = null) {
  const token = process.env['SPOTIFY_TOKEN'];
  let payload: Record<string, any> = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
  };
  if (body) payload.body = JSON.stringify(body);
  const res = await fetch(`https://api.spotify.com/${endpoint}`, payload);

  return await res.json();
}

export async function UpdatePlaylist(playlist_id: string, uris: string) {
  console.log(`Adding ${uris} to ${playlist_id}`);
  return await fetchWebApi(`v1/playlists/${playlist_id}/tracks?uris=${uris}`, 'PUT', {
    range_start: 1,
  });
}

export async function getTopTracks() {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi('v1/me/top/tracks?time_range=short_term&limit=10', 'GET')).items;
}
