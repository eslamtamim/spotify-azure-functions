import { app, HttpRequest, HttpResponse, InvocationContext } from '@azure/functions';
import { getCurrentPlaying, setCurrentPlaying } from '../helpers/spotifty_helpers';

async function play(req: HttpRequest, _: InvocationContext): Promise<HttpResponse> {
  let id = req.query.get('id');
  if (id) {
    if (id.includes('track')) {
      id = id.match(/https:\/\/open.spotify.com\/track\/([^?]+)/)[1];
    }
    console.log('req.url: ', req.url, 'id: ', id);
    await setCurrentPlaying(id);
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
               input[type="text"] {
                all: unset; /* Resets all inherited and default styles */
                width: 300px;
                padding: 10px;
                margin-right: 20px;
                background: transparent;
                border: none;
                outline: none;
                font-family: inherit; /* Use the parent's font */
                font-size: inherit;  /* Use the parent's font size */
                color: inherit;      /* Use the parent's text color */
              }
          </style>
        </head>
        <body onload="window.history.pushState({}, '', window.location.pathname);">
          <div>
          ${
            playing &&
            playing.is_playing &&
            playing?.item?.album?.images[0]?.url &&
            `<img src="${playing.item.album.images[0].url}" width="300" alt="album cover"/>`
          }
            <p>${playing_status}</p>
          <form action="/api/play" method="get" style ="position: fixed;bottom: 0;right: 0;">
            <input type="text" name="id" style="width: 300px; padding: 10px; margin-right: 20px;po">
          </form>
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
