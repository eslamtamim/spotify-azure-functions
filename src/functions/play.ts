import { app, HttpRequest, HttpResponse, InvocationContext } from '@azure/functions';
import { getCurrentPlaying, setCurrentPlaying } from '../helpers/spotifty_helpers';

async function play(req: HttpRequest, _: InvocationContext): Promise<HttpResponse> {
  const id = req.query.get('id');
  // let res: Record<string, any> = {};
  if (id) {
    console.log('req.url: ', req.url, 'id: ', id);
    await setCurrentPlaying(id);
    // res = { set_current: 'ok', ...res };
  }
  const playing = await getCurrentPlaying();
  const playing_status = playing.is_playing
    ? `${playing.item.name} - ${playing.item.artists.map((e: { name: any }) => e.name).join(', ')}`
    : 'not playing or paused, ping me a song :D';
  const htmlResponse = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
              text-align: center;
            }
            h1 {
              font-size: 2em;
              font-weight: bold;
            }
            p {
              font-size: 1.5em;
              font-weight: bold;
            }
            img {
              display: block;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <div>
          ${playing.item.album.images[0]?.url && `<img src="${playing.item.album.images[0].url}" width="300" alt="album cover"/>`}
            <p>${playing_status}</p>
          </div>
        </body>
      </html>
    `;
  return new HttpResponse({
    status: 200,
    headers: { 'Content-Type': 'text/html' },
    body: htmlResponse,
  });
}
app.http('play', { route: 'play', methods: ['GET'], handler: play });
