/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 * https://linkedin-ai.bappy-llcg.workers.dev/
 */


// export default {
//   async fetch(request, env, ctx) {
//     return new Response('Hello World!');
//   },
// };

export default {
    async fetch(request, ctx) {
      const apiKey = 'AIzaSyCJ-mt46PxHgr4QEAKmmS7uQFGK1ubWsTU'; // Secure way: from wrangler.toml
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
      // Handle only POST requests
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Only POST requests are allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
  
      let linkedinPost = '';
  
      try {
        const { prompt: userPrompt } = await request.json();
        if (!userPrompt) {
          return new Response(JSON.stringify({ error: 'Prompt is required in the body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }
        linkedinPost = userPrompt;
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
  
      const body = JSON.stringify({
        contents: [
          {
            parts: [{ text: `Create 2 line Linkedin comment for this post: ${linkedinPost}
                
                - Experienced, Casual, Bold and friendly vibe engaged in the topic.
                - Use emojis to make the comment more engaging.
                - Use a casual tone.
                - Use a maximum of 2 lines.

                Provide only the comment without any introduction or explanation.` }]
          }
        ]
      });
  
      try {
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body
        });
  
        if (!response.ok) {
          return new Response(JSON.stringify({ error: `Gemini API error`, status: response.status }), {
            status: response.status,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }
  
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
  
        return new Response(JSON.stringify({ response: reply }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }
  };