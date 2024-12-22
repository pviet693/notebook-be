import slugify from "slugify";

import sequelize from "@/configs/database.config";
import Category from "@/models/Category";

async function seedCategories() {
    try {
        // Check if the Category table is empty
        const count = await Category.count();

        if (count === 0) {
            console.log("Category table is empty. Seeding categories...");

            const categories = [
                {
                    name: "Electronics",
                    description: "Devices and gadgets including phones, laptops, and other tech products"
                },
                { name: "Furniture", description: "Furniture for homes and offices" },
                { name: "Clothing", description: "Apparel for men, women, and children" },
                {
                    name: "Books",
                    description: "Books of various genres including fiction, non-fiction, and educational"
                },
                { name: "Sports", description: "Sporting goods and fitness equipment" },
                { name: "News", description: "Latest news and updates from around the world" },
                { name: "Education", description: "Educational resources and learning materials" },
                { name: "Programming", description: "Programming languages, frameworks, and development tools" },
                { name: "Entertainment", description: "Movies, music, gaming, and other forms of entertainment" },
                { name: "Food", description: "Food recipes, restaurants, and culinary delights" },
                { name: "Travel", description: "Travel destinations, guides, and tips" },
                { name: "Health", description: "Health, fitness, and wellness topics" },
                { name: "Social Media", description: "Social media platforms, trends, and influencers" }
            ];

            const categoriesWithSlugs = categories.map((category) => ({
                ...category,
                slug: slugify(category.name, { lower: true, strict: true })
            }));

            // Bulk create the categories in the database
            await Category.bulkCreate(categoriesWithSlugs);
            console.log("Categories have been seeded successfully.");
        } else {
            console.log("Category table already contains data. Skipping seeding.");
        }
    } catch (error) {
        console.error("Error seeding categories:", error);
    }
}

// Sync the database and run the seeding process
async function initializeCategories() {
    try {
        // Syncing the database (creates table if not exists)
        await sequelize.sync(); // Use { force: true } if you want to drop and recreate the table
        console.log("Database synchronized!");

        // Seed categories
        await seedCategories();
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

// npx tsx category.init.ts

initializeCategories();
