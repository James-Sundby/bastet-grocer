import { CATEGORIES } from "@/app/constants/categories";

const DEFAULT_CATEGORY = "other";

const validCategories = new Set(
    CATEGORIES.map((category) => category.value)
);

const CATEGORY_KEYWORDS = {
    produce: [
        "apple",
        "apples",
        "avocado",
        "avocados",
        "banana",
        "bananas",
        "berries",
        "blueberries",
        "broccoli",
        "carrot",
        "carrots",
        "celery",
        "cucumber",
        "cucumbers",
        "egg plant",
        "eggplant",
        "garlic",
        "grape tomato",
        "grape tomatoes",
        "grapes",
        "green onion",
        "green onions",
        "kiwi",
        "kiwis",
        "lettuce",
        "lemon",
        "lemons",
        "lil tomats",
        "lil tomatoes",
        "lime",
        "limes",
        "mushroom",
        "mushrooms",
        "onion",
        "onions",
        "orange",
        "oranges",
        "parsley",
        "pear",
        "pears",
        "pepper",
        "peppers",
        "potato",
        "potatoes",
        "small potatoes",
        "tomato",
        "tomatoes",
        "zucchini",
    ],

    dairy: [
        "block cheese",
        "butter",
        "cheese",
        "cheese block",
        "cottage cheese",
        "cream",
        "cream cheese",
        "egg",
        "eggs",
        "milk",
        "oat milk",
        "shredded cheese",
        "sour cream",
        "yogurt",
    ],

    bakery: [
        "bagel",
        "bagels",
        "bread",
        "bun",
        "buns",
        "cake",
        "croissant",
        "croissants",
        "english muffin",
        "english muffins",
        "muffin",
        "muffins",
        "pita",
        "tortilla",
        "tortillas",
        "wrap",
        "wraps",
    ],

    meat: [
        "bacon",
        "beef",
        "breakfast sausage",
        "breakfast sausages",
        "chicken",
        "ground beef",
        "ground chicken",
        "ham",
        "pork",
        "sausage",
        "sausages",
        "steak",
        "steaks",
        "turkey",
    ],

    "frozen foods": [
        "chicken strip",
        "chicken strips",
        "cool whip",
        "eggo",
        "eggos",
        "french fries",
        "fries",
        "frozen berries",
        "frozen fruit",
        "frozen pizza",
        "frozen spinach",
        "frozen vegetables",
        "ice cream",
        "onion pancake",
        "onion pancakes",
        "popsicle",
        "popsicles",
        "spinach",
        "waffle",
        "waffles",
    ],

    "canned goods": [
        "alfredo sauce",
        "beans",
        "canned beans",
        "canned corn",
        "canned soup",
        "canned tomatoes",
        "chicken soup",
        "chickpeas",
        "green chiles",
        "green chilies",
        "italian wedding",
        "italian wedding soup",
        "kidney beans",
        "olives",
        "pasta sauce",
        "pinto beans",
        "pizza sauce",
        "red kidney beans",
        "soup",
        "tomato paste",
        "tomato soup",
        "tuna",
    ],

    "dry goods": [
        "apple sauce",
        "applesauce",
        "beef and broccoli mix",
        "beef and brocolli mix",
        "beef bouillon",
        "beef broth",
        "beef stock",
        "bulgogi sauce",
        "cajun seasoning",
        "cereal",
        "chai",
        "chai tea",
        "chicken bouillon",
        "chicken broth",
        "chicken stock",
        "coffee",
        "cookies",
        "cracker",
        "crackers",
        "curry block",
        "decaf",
        "decaf coffee",
        "flour",
        "japanese curry block",
        "kd",
        "kraft dinner",
        "lasagna noodles",
        "lentils",
        "mild bulgogi sauce",
        "mint tea",
        "oatmeal",
        "oats",
        "olive oil",
        "oreos",
        "pasta",
        "rice",
        "rice crackers",
        "spice",
        "spices",
        "sugar",
        "taco seasoning",
        "tacos",
        "tea",
        "vegetable broth",
        "vegetable stock",
    ],

    beverages: [
        "cream soda",
        "juice",
        "pop",
        "soda",
        "sparkling water",
        "sports drink",
        "water",
    ],

    snacks: [
        "candy",
        "chips",
        "chocolate",
        "granola bar",
        "granola bars",
        "nacho chips",
        "nuts",
        "popcorn",
        "popcorn seasoning",
        "rice cake",
        "rice cakes",
    ],

    household: [
        "aluminum foil",
        "bathroom cleaner",
        "clorox",
        "clorox bathroom cleaner",
        "dish soap",
        "dishwasher tab",
        "dishwasher tabs",
        "dishwasher tablet",
        "dishwasher tablets",
        "dryer sheet",
        "dryer sheets",
        "garbage bags",
        "laundry detergent",
        "laundry soap",
        "paper towel",
        "paper towels",
        "pt",
        "resolve",
        "sponge",
        "sponges",
        "stain remover",
        "toilet bowl cleaner",
        "toilet cleaner",
        "toilet paper",
        "tp",
        "windex",
    ],

    deli: [
        "baby bel",
        "baby bels",
        "babybel",
        "babybels",
        "boursin",
        "deli meat",
        "deli turkey",
        "hot genoa",
        "hummus",
        "lunch meat",
        "pepperoni",
        "salami",
    ],

    pharmacy: [
        "acetaminophen",
        "advil",
        "allergy medicine",
        "allergy meds",
        "band aid",
        "band aids",
        "bandaid",
        "bandaids",
        "bandage",
        "bandages",
        "fiber",
        "ibuprofen",
        "lacteeze",
        "medicine",
        "painkillers",
        "protein bar",
        "protein bars",
        "tums",
        "tylenol",
        "vitamins",
    ],

    "bath and body": [
        "body wash",
        "bubble bath",
        "conditioner",
        "deodorant",
        "face wash",
        "floss",
        "hand soap",
        "shampoo",
        "soap",
        "toothbrush",
        "toothpaste",
    ],
};

const keywordRules = Object.entries(CATEGORY_KEYWORDS)
    .flatMap(([category, terms]) =>
        terms.map((term) => ({
            category,
            term: normalizeForCategoryMatch(term),
        }))
    )
    // Longer phrases must win over shorter words.
    // For example, "ice cream" must be checked before "cream".
    .sort((first, second) => second.term.length - first.term.length);

export function normalizeItemNameKey(name) {
    return String(name ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function normalizeForCategoryMatch(name) {
    return normalizeItemNameKey(name)
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function isValidItemCategory(category) {
    return validCategories.has(category);
}

export function suggestLocalCategory(name) {
    const normalizedName = normalizeForCategoryMatch(name);

    if (!normalizedName) {
        return null;
    }

    const searchableName = ` ${normalizedName} `;

    const matchingRule = keywordRules.find(({ term }) =>
        searchableName.includes(` ${term} `)
    );

    if (!matchingRule) {
        return null;
    }

    return {
        category: matchingRule.category,
        source: "keyword",
        matchedTerm: matchingRule.term,
    };
}

export function getItemCategorySuggestion(
    name,
    preferenceMap = new Map()
) {
    const nameKey = normalizeItemNameKey(name);

    if (!nameKey) {
        return {
            category: DEFAULT_CATEGORY,
            source: "fallback",
            matchedTerm: null,
        };
    }

    const rememberedCategory = preferenceMap.get(nameKey);

    if (isValidItemCategory(rememberedCategory)) {
        return {
            category: rememberedCategory,
            source: "preference",
            matchedTerm: null,
        };
    }

    const localSuggestion = suggestLocalCategory(name);

    if (localSuggestion) {
        return localSuggestion;
    }

    return {
        category: DEFAULT_CATEGORY,
        source: "fallback",
        matchedTerm: null,
    };
}