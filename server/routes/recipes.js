import { Router } from 'express';
import pool from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const localRecipes = [
  {
    title: 'Spinach and Tomato Skillet',
    description: 'A quick, flexible skillet for vegetables that need using soon.',
    matchingIngredients: ['spinach', 'tomato'],
    pantryStaplesNeeded: ['olive oil', 'salt', 'pepper'],
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    difficulty: 'Easy',
    zeroWasteTip: 'Use tender stems and wilted greens; they soften in the skillet.',
    steps: ['Warm oil in a pan.', 'Add chopped vegetables and cook until tender.', 'Season and serve with pantry staples.'],
    co2DivertedKg: 1.2,
  },
  {
    title: 'Chickpea Pantry Bowl',
    description: 'Turn odds and ends into a hearty, low-waste bowl.',
    matchingIngredients: ['chickpea', 'yogurt', 'greens'],
    pantryStaplesNeeded: ['lemon', 'olive oil'],
    prepTimeMinutes: 10,
    cookTimeMinutes: 5,
    difficulty: 'Easy',
    zeroWasteTip: 'Use the liquid from canned chickpeas in a dressing or save it for another recipe.',
    steps: ['Warm the chickpeas.', 'Layer with available greens and yogurt.', 'Finish with lemon and oil.'],
    co2DivertedKg: 1.5,
  },
];

router.get('/suggest', authenticate, async (req, res, next) => {
  try {
    const [items] = await pool.execute(
      `SELECT id, name, category, quantity, unit, expiry_date AS expiryDate
       FROM inventory_items WHERE user_id = ? AND status = 'active'
         AND expiry_date IS NOT NULL
       ORDER BY expiry_date ASC LIMIT 12`,
      [req.user.id],
    );
    const ingredients = items.map((item) => item.name);
    let recipes = [];
    try {
      if (ingredients.length) {
        const ingredient = encodeURIComponent(ingredients[0].split(/\s+/).at(-1));
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`,
          { signal: AbortSignal.timeout(5000) },
        );
        if (response.ok) {
          const payload = await response.json();
          recipes = (payload.meals || []).slice(0, 8).map((meal) => ({
            id: `mealdb-${meal.idMeal}`,
            title: meal.strMeal,
            description: 'A recipe suggestion matched to ingredients nearing expiry.',
            matchingIngredients: ingredients.slice(0, 3),
            pantryStaplesNeeded: [],
            prepTimeMinutes: 15,
            cookTimeMinutes: 25,
            difficulty: 'Medium',
            zeroWasteTip: 'Use the ingredients that are closest to their expiry date first.',
            steps: ['Review the full recipe instructions on TheMealDB.'],
            co2DivertedKg: 1,
            image: meal.strMealThumb,
          }));
        }
      }
    } catch (error) {
      console.warn(`TheMealDB lookup failed; using local suggestions: ${error.message}`);
    }
    if (!recipes.length) {
      recipes = localRecipes
        .map((recipe) => ({
          ...recipe,
          matchPercent: recipe.matchingIngredients.filter((needle) =>
            ingredients.some((name) => name.toLowerCase().includes(needle)),
          ).length / Math.max(1, recipe.matchingIngredients.length) * 100,
        }))
        .sort((a, b) => b.matchPercent - a.matchPercent);
    }
    return res.json({ recipes, expiringItems: items });
  } catch (error) {
    return next(error);
  }
});

export default router;
