import { redirect } from "next/navigation";

// Old URL kept for existing links; the recipe page now lives at /recipes/[id].
export default async function RecipePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    redirect(`/recipes/${id}?from=dashboard`);
}
