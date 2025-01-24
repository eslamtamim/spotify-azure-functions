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

  // Get the album cover URL
  const albumCoverUrl = playing?.item?.album?.images[0]?.url;

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
              background-image: url(${albumCoverUrl});
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
              backdrop-filter: blur(70px);
            }
            h1 {
              font-size: 2em;
              font-weight: bold;
            }
            p {
              font-size: 1.5em;
              font-weight: bold;
            }
            input[type="text"] {
              all: unset;
              width: 300px;
              padding: 10px;
              margin-right: 20px;
              background: transparent;
              border: none;
              outline: none;
              font-family: inherit;
              font-size: inherit;
              color: inherit;
            }
            .album-stack {
              position: relative;
              height: 300px;
              margin-bottom: 20px;
            }
            .album-stack img {
              position: absolute;
              top: 0;
              width: 300px;
              border-radius: 10px;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
              transition: transform 0.3s ease, box-shadow 0.3s ease;
              cursor: pointer;
            }
            .album-stack img:hover {
              transform: translateY(-10px) scale(1.05);
              box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
              z-index: 10;
            }
          </style>
        </head>
        <body onload="window.history.pushState({}, '', window.location.pathname);">
          <div>
            <div class="album-stack">
              ${albumCoverUrl ? `
                <img src="${albumCoverUrl}" alt="album cover" style="left: 0; z-index: 6;">
                <img src="${albumCoverUrl}" alt="album cover" style="left: 20px; z-index: 5;">
                <img src="${albumCoverUrl}" alt="album cover" style="left: 40px; z-index: 4;">
                <img src="${albumCoverUrl}" alt="album cover" style="left: 60px; z-index: 3;">
                <img src="${albumCoverUrl}" alt="album cover" style="left: 80px; z-index: 2;">
                <img src="${albumCoverUrl}" alt="album cover" style="left: 100px; z-index: 1;">
              ` : ''}
            </div>
            <p style="background-color: black;color: white;padding: 4px;">${playing_status}</p>
            <form action="/api/play" method="get" style="position: fixed;bottom: 0;right: 0;">
              <input type="text" name="id" style="width: 300px; padding: 10px; margin-right: 20px;">
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
