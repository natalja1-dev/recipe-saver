import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Supabase GET error:", error);

    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function POST(request) {
  try {
    const body = await request.json();

    const title = body.title?.trim();
    const category = body.category?.trim();
    const ingredients = body.ingredients?.trim();
    const description = body.description?.trim() || null;

    if (!title || !category || !ingredients) {
      return Response.json(
        { error: "Title, category and ingredients are required." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("recipes")
      .insert({
        title,
        category,
        ingredients,
        description,
      })
      .select()
      .single();

    if (error) {
      return Response.json(
        { error: "Could not save recipe." },
        { status: 500 },
      );
    }

    return Response.json(data, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
}
