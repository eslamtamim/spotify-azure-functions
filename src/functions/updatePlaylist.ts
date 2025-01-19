import { app, InvocationContext, Timer } from '@azure/functions';
import { getTopTracks, UpdatePlaylist } from '../../helpers/spotifty_helpers';

export async function updatePlaylist(myTimer: Timer, context: InvocationContext): Promise<void> {
  const uris = (await getTopTracks())?.map((track: any) => track.uri).join(',');
  const playlist_id = process.env['SPOTIFY_PLAYLIST_ID'];
  if (!playlist_id || !uris) {
    console.error('Playlist ID or URIs not found');
    throw new Error('Playlist ID or URIs not found');
  }
  console.log('Playlist ID:', playlist_id);
  console.log('URIs:', uris);
  console.log('Output:', await UpdatePlaylist(playlist_id, uris));
}

// every one min
/* app.timer('updatePlaylist', {
  schedule: '0 * * * * *',
  handler: updatePlaylist,
});
 */

// every one day
app.timer('updatePlaylist', {
  schedule: '0 0 * * *',
  handler: updatePlaylist,
});
