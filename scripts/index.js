//Function to get Navbar and add it to Page
document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("header");
  const getNavBar = async () => {
    try {
      const navbar = await fetch("./components/navbar.html");
      const navbarText = await navbar.text();
      header.innerHTML = navbarText;
    } catch (err) {
      console.error("Error fetching navbar:", err);
    }
  };

  getNavBar();
});

const getCategories = async () => {
  const categories = await fetch("../data/categories.json");
  const result = await categories.json();
  return result.categories;
};

class Category {
  constructor(description, imageUrl) {
    this.description = description;
    this.imageUrl = imageUrl;
  }

  createCategory() {
    const category = document.createElement("div");
    category.classList.add("category-item", "mx-auto");

    const categoryImage = document.createElement("img");
    categoryImage.src = this.imageUrl;
    categoryImage.classList.add("category-img", "d-block", "mx-auto");

    const categoryDescription = document.createElement("p");
    categoryDescription.classList.add("text-center");
    categoryDescription.textContent = this.description;

    category.appendChild(categoryImage);
    category.appendChild(categoryDescription);
    
    return category;
  }
}

const populateCategories = async () => {
  const categoriesContainer = document.getElementById("category-container");

  const categories = await getCategories();

  categories.forEach((category)=>{
    const newCategory = new Category(category.name, category.image)
    categoriesContainer.appendChild(newCategory.createCategory());
  })
  
};

populateCategories();
