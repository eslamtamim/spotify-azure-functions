import { app, HttpRequest, HttpResponse } from '@azure/functions';

async function play(req: HttpRequest): Promise<HttpResponse> {
  const body = await req.json();
  const params = req.params;

  return new HttpResponse({
    status: 200,
    body: JSON.stringify(params),
  });
}
app.http('play', { route: 'play', methods: ['GET', 'POST'], handler: play });
