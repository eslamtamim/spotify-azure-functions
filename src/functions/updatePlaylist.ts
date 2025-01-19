import { app, InvocationContext, Timer } from '@azure/functions';
import { getTopTracks, UpdatePlaylist } from '../../helpers/spotifty_helpers';

export async function updatePlaylist(myTimer: Timer, context: InvocationContext) {
  const uris = (await getTopTracks())?.map((track: any) => track.uri).join(',');
  const playlist_id = process.env['SPOTIFY_PLAYLIST_ID'];
  if (!playlist_id || !uris) {
    console.error('Playlist ID or URIs not found');
    throw new Error('Playlist ID or URIs not found');
  }
  console.info('Playlist ID:', playlist_id);
  console.info('URIs:', uris);
  const output = await UpdatePlaylist(playlist_id, uris);
  if (!output || !output.snapshot_id || output.error) {
    console.error('Failed to update playlist');
    throw new Error('Failed to update playlist');
  }
  console.info('Output:', output);
  return output;
}

if (process.env['DEV']) {
  // every one min
  app.timer('updatePlaylist', {
    schedule: '0 * * * * *',
    handler: updatePlaylist,
  });
} else {
  // every one day
  app.timer('updatePlaylist', {
    schedule: '0 0 * * *',
    handler: updatePlaylist,
  });
}
