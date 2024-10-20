module.exports = (product_name, product_price, name, size) => {
  let response;

  if (product_name === "") {
    response = {
      mes: "Не указано название товара",
      status: "Error",
    };
  }

  if (product_price === "") {
    response = {
      mes: "Не указана цена",
      status: "Error",
    };
  }

  if (name === "" || size === 0) {
    response = {
      mes: "Не загружена картинка",
      status: "Error",
    };
  }

  return response;
};
