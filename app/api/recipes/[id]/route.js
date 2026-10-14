import { supabase } from "@/lib/supabase";

export async function DELETE(request, { params }) {
  const { id } = await params;

  const { error } = await supabase.from("recipes").delete().eq("id", id);

  if (error) {
    return Response.json(
      { error: "Could not delete recipe." },
      { status: 500 },
    );
  }

  return Response.json({
    message: "Recipe deleted.",
  });
}
