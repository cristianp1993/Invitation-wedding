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

    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error("RSVP error:", err);
    return Response.json(
      { success: false, error: "Error al conectar con el servidor" },
      { status: 500 }
    );
  }
}
