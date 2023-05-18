var appDiv = document.getElementById('app');

async function renderHomePage() {
  const response = await fetch('home-template.html');
  const htmlContent = await response.text();
  appDiv.innerHTML = htmlContent;
  await renderCategories("index", 'indexCategories')
    .then(addEvents("categoriesLink", renderCategoriesPage));
  addEvents("homeLink", renderHomePage);
  addEvents("aboutLink", renderAboutPage);
}

async function renderCategoriesPage() {
  const response = await fetch('categories-template.html');
  const htmlContent = await response.text();
  appDiv.innerHTML = htmlContent;
  await renderCategories("page", 'categoriesContainer');
}

async function renderCategories(template, element) {
  try {
    const categories = await fetchCategories();
    var categoryLinks = document.getElementById(element);
    categoryLinks.innerHTML = '';

    categories.forEach(category => {
      const categoryIndexTemplate = `
        <a href="#"
          class="flex flex-col justify-center max-h-20 w-full relative md:max-h-60 md:hover:scale-105 transform duration-300 hover:opacity-90"
          data-category="${category.id}">
          <div class="bg-gradient-to-b from-black/10 to-black/30 absolute left-0 top-0 w-full h-20 md:h-60"></div>
          <img src="${category.photo}" alt=""
            class="object-cover w-full h-20 md:h-60 blur-[1px] hover:blur-none">
          <div class="absolute w-full flex justify-center flex-wrap overflow-hidden">
            <h3 class="text-2xl text-white font-semibold md:text-3xl">${category.name}</h3>
          </div>
        </a>
      `;
      const categoryPageTemplate = `
          <a href="#" class="flex flex-col md:first:col-span-3 md:first:row-span-3 justify-center max-h-20 w-full relative md:max-h-full md:hover:scale-105 transform duration-300 hover:opacity-90">
            <div class="bg-gradient-to-b from-black/10 to-black/30 absolute left-0 top-0 w-full h-20 md:h-full"></div>
            <img src="${category.photo}" alt="" class="object-cover w-full h-20 md:h-full blur-[1px] hover:blur-none">
            <div class="absolute w-full flex justify-center flex-wrap overflow-hidden">
              <h3 class="text-2xl text-white font-semibold md:text-3xl">${category.name}</h3>
            </div>
          </a>
      `;
      var categoryTemplate = template === "index" ? categoryIndexTemplate : categoryPageTemplate;
      categoryLinks.insertAdjacentHTML('beforeend', categoryTemplate);

      const categoryElement = categoryLinks.lastElementChild;
      categoryElement.addEventListener('click', function (event) {
        event.preventDefault();
        renderCategoryItems(category.id);
      });
    });
  } catch (error) {
    console.error(error);
  }
}

async function renderCategoryItems(categoryId) {
  try {
    const response = await fetch('items-template.html');
    const htmlContent = await response.text();
    appDiv.innerHTML = htmlContent;

    const category = await fetchCategoryById(categoryId);
    var itemsContainer = document.getElementById("itemsContainer");
    category.forEach(item => {
      const itemTeplate = `
        <a href="#" class="container space-y-3 space-x-0 flex-col md:flex-row flex p-4 md:space-x-3 
        md:space-y-0 hover:scale-105 hover:shadow-md  transform duration-300  shadow-sm">
            <div class=" w-full flex justify-center md:w-1/3 ">
                <img src="${item.photo}" class="w-4/5 object-cover" alt="" />
            </div>
            <div class="flex flex-col text-center md:text-left md:w-2/3 space-y-3">
                <div class="flex flex-col justify-center md:flex-row md:justify-between items-center">
                    <h3 class=" text-2xl md:text-3xl w-full md:w-10/12">${item.title}</h3>
                    <span class="text-xs text-zinc-400 text-center w-2/12">${new Date(item.date).toDateString()}</span>
                </div>
                <div class="overflow-hidden h-[100px] text-sm md:text-md">
                    ${item.text}
                </div>
            </div>
        </a>
      `;
      itemsContainer.insertAdjacentHTML('beforeend', itemTeplate);

      const itemElement = itemsContainer.lastElementChild;
      itemElement.addEventListener('click', function (event) {
        event.preventDefault();
        renderItemPage(item);
      });
    });
  } catch (error) {
    console.error(error);
  }
}

function renderItemPage(item) {
  appDiv.innerHTML = `
  <main>
    <section id="item"
        class="flex max-w-6xl justify-center items-center  flex-col mx-auto py-12 px-6 ">
        <div class="flex flex-col space-y-2 p-3 bg-zinc-50/50 ">
            <div class="p-2 bg-white shadow-sm shadow-white hover:shadow-md transform duration-300 hover:scale-[1.01]">
                <div class="flex flex-col space-y-2 md:flex-row md:space-y-0 justify-center items-center mb-7  md:justify-between p-2">
                    <h2
                        class="text-4xl px-4 text-center uppercase w-11/12 text-red-950 md:text-left md:text-5xl">
                        ${item.title}
                    </h2>
                    <span class="text-zinc-400  text-sm w-1/12 text-left">${new Date(item.date).toDateString()}</span>
                </div>
                <div class="w-full flex justify-center items-center px-1 py-4">
                    <img src="${item.photo}" class="w-11/12 " alt="">
                </div>
            </div>
            <div class="bg-white px-14 shadow-sm shadow-white py-2  hover:shadow-md transform duration-300 hover:scale-[1.01]">
            <span class="text-sm md:text-lg">
              ${item.text}
            </span>
            </div>
        </div>
    </section>
  </main>
  `;
}

function fetchCategories() {
  return new Promise((resolve, reject) => {
    fetch('data/categories.json')
      .then(response => response.json())
      .then(data => {
        resolve(data.categories);
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
  });
}

function fetchCategoryById(categoryId) {
  return new Promise((resolve, reject) => {
    fetch('data/category' + categoryId + '.json')
      .then(response => response.json())
      .then(data => {
        resolve(data.items);
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
  });
}

function addEvents(className, func) {
  var links = document.getElementsByClassName(className);
  var linksArray = Array.from(links);
  linksArray.forEach(link => {
    link.addEventListener('click', function (event) {
      func();
    });
  });
}

async function renderAboutPage() {
  const response = await fetch('about-template.html');
  const htmlContent = await response.text();
  appDiv.innerHTML = htmlContent;
}
// Initial home page rendering
renderHomePage();