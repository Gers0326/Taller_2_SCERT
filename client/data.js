document.addEventListener("DOMContentLoaded", () => {
    App.init();
});

const salesForm = document.getElementById("salesForm");

salesForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const productName = salesForm["name"].value;
    const price = salesForm["price"].value;
    const description = salesForm["description"].value;
    console.log({
        "product name": productName,
        "price": price,
        "description":description
    })
    salesForm.reset();
    App.createSale(productName,description,price)
  });