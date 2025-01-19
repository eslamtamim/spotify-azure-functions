import { app, InvocationContext, Timer } from '@azure/functions';
import { getTopTracks, UpdatePlaylist } from '../../helpers/spotifty_helpers';

export async function updatePlaylist(myTimer: Timer, context: InvocationContext): Promise<void> {
  const uris = (await getTopTracks())?.map((track: any) => track.uri).join(',');
  const playlist_id = process.env['SPOTIFY_PLAYLIST_ID'];
  if (!playlist_id || !uris) {
    console.log('Playlist ID or URIs not found');
  }
  console.log('Playlist ID:', playlist_id);
  console.log('URIs:', uris);
  const output = await UpdatePlaylist(playlist_id, uris);
  console.log('Output:', output);
  return output;
}
app.timer('updatePlaylist', {
  schedule: '0 0 * * *',
  handler: updatePlaylist,
});
