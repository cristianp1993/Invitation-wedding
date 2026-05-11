const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL ?? "";

export async function POST(request: Request) {
  try {
    if (!APPS_SCRIPT_URL) {
      return Response.json(
        { success: false, error: "APPS_SCRIPT_URL no configurada" },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log("RSVP request body:", body);

    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    console.log("Apps Script response status:", res.status);
    console.log("Apps Script response headers:", Object.fromEntries(res.headers.entries()));

    const text = await res.text();
    console.log("Apps Script response text:", text);

    if (!res.ok) {
      return Response.json(
        { success: false, error: `Error del script: ${res.status} - ${text}` },
        { status: res.status }
      );
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: true, message: text };
    }

    return Response.json(data);
  } catch (err) {
    console.error("RSVP error:", err);
    return Response.json(
      { success: false, error: `Error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
