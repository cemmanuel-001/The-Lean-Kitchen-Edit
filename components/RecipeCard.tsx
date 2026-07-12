type Recipe = {
  name: string;
  prep: string;
  servings: string;
  calories: string;
  ingredients: string[];
  steps: string[];
};

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="card not-prose my-6" itemScope itemType="https://schema.org/Recipe">
      <meta itemProp="name" content={recipe.name} />
      <h4 className="font-display text-lg font-bold mb-1">{recipe.name}</h4>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink/60 mb-4">
        <span itemProp="prepTime">⏱ {recipe.prep}</span>
        <span itemProp="recipeYield">🍽 {recipe.servings}</span>
        <span>~{recipe.calories} (estimated)</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h5 className="eyebrow mb-2">Ingredients</h5>
          <ul className="space-y-1 text-sm">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} itemProp="recipeIngredient">
                {ing}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="eyebrow mb-2">Steps</h5>
          <ol className="space-y-1 text-sm list-decimal ml-4">
            {recipe.steps.map((step, i) => (
              <li key={i} itemProp="recipeInstructions">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
