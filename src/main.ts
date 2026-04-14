import "./scss/styles.scss";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { Cart } from "./components/models/Cart";
import { Customer } from "./components/models/Customer";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { WebLarekApi } from "./components/base/WebLarekApi";
import { CatalogCard } from "./components/view/Card/CatalogCard";
import { OpenedCard } from "./components/view/Card/OpenedCard";
import { BasketCard } from "./components/view/Card/BasketCard";
import { EventEmitter } from "./components/base/Events";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { CDN_URL } from "./utils/constants";
import { Modal } from "./components/view/Modal";
import { Header } from "./components/view/Header";
import { Basket } from "./components/view/Basket";
import { Gallery } from "./components/view/Gallery";
import { FormOrderStep1 } from "./components/view/Form/FormOrderStep1";
import { FormOrderStep2 } from "./components/view/Form/FormOrderStep2";
import { Success } from "./components/view/Success";
import type { IBuyer } from "./types/index";

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);
const events = new EventEmitter();
const catalog = new ProductCatalog(events);
const customer = new Customer(events);
const modal = new Modal(
  document.querySelector("#modal-container") as HTMLElement,
);
const cart = new Cart(events);
const basket = new Basket(events, cloneTemplate<HTMLElement>("#basket"));
const header = new Header(
  events,
  document.querySelector(".header") as HTMLElement,
);
const formStep1 = new FormOrderStep1(
  events,
  cloneTemplate<HTMLElement>("#order"),
);
const formStep2 = new FormOrderStep2(
  events,
  cloneTemplate<HTMLElement>("#contacts"),
);
const successWindow = new Success(cloneTemplate<HTMLElement>("#success"));
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));

//отрисовка галереи:
events.on("catalog:changed", () => {
  const cards = catalog.getProducts().map((product) => {
    const el = cloneTemplate<HTMLElement>("#card-catalog");

    const cardCatalog = new CatalogCard(el, {
      onClick: () => events.emit("product:select", { id: product.id }),
    });

    cardCatalog.title = product.title;

    cardCatalog.image = `${CDN_URL}${product.image}`;
    cardCatalog.category = product.category;
    cardCatalog.price = product.price;

    return cardCatalog.render();
  });

  gallery.items = cards;
});

//загружаем данные о товарах:
try {
  const recievedProducts = await webLarekApi.getProducts();
  catalog.setProducts(recievedProducts.items);
} catch (error) {
  console.error("Список товаров не загружен. Возникла ошибка: ", error);
}

//открытие карточки с выбранным продуктом
events.on<{ id: string }>("product:select", ({ id }) => {
  const selectedProduct = catalog.getProductById(id);
  if (!selectedProduct) {
    return;
  }
  catalog.setSelectedProduct(selectedProduct);
});

//обновление выбранного продукта
events.on("catalog:selectedChanged", () => {
  const selectedProduct = catalog.getSelectedProduct();
  if (!selectedProduct) {
    return;
  }

  const clonePreviewCard = cloneTemplate<HTMLElement>("#card-preview");
  const previewCard = new OpenedCard(clonePreviewCard, {
    onToggle: () => events.emit("product:toggle", { id: selectedProduct.id }),
  });

  previewCard.description = selectedProduct.description;
  previewCard.image = `${CDN_URL}${selectedProduct.image}`;
  previewCard.title = selectedProduct.title;
  previewCard.category = selectedProduct.category;
  previewCard.price = selectedProduct.price;

  previewCard.buttonText = cart.hasItem(selectedProduct.id)
    ? "Удалить из корзины"
    : "Купить";
  previewCard.buttonEnabled = selectedProduct.price !== null;

  modal.open(previewCard.render());
});

//добавление/удаление из корзины в карточке товара
events.on("product:toggle", () => {
  const item = catalog.getSelectedProduct();
  if (!item) {
    return;
  }
  if (cart.hasItem(item.id)) {
    cart.removeItem(item);
  } else {
    cart.addItem(item);
  }
  modal.close();
});

//изменения в корзине
events.on("cart:changed", () => {
  header.counter = cart.getTotalQuantity();
  const items = cart.getItems();

  const basketCards = items.map((item, index) => {
    const basketCardEl = cloneTemplate<HTMLElement>("#card-basket");
    const basketCard = new BasketCard(basketCardEl, {
      onRemove: () => events.emit("basket:removeItem", { id: item.id }),
    });
    basketCard.title = item.title;
    basketCard.price = item.price ?? 0;
    basketCard.index = index + 1;

    return basketCard.render();
  });

  basket.items = basketCards;
  basket.total = cart.getTotalPrice();
});

//открытие корзины
events.on("basket:open", () => {
  modal.open(basket.render());
});

//удаление из корзины
events.on<{ id: string }>("basket:removeItem", ({ id }) => {
  const delItem = cart.getItems().find((item) => item.id === id);
  if (delItem) {
    cart.removeItem(delItem);
  }
});

//оформление заказа в корзине
events.on("basket:checkout", () => {
  modal.open(formStep1.render());
});

//измениения в форме
events.on<{ field: keyof IBuyer; value: string }>(
  "form:change",
  ({ field, value }) => {
    customer.update({ [field]: value });
  },
);

events.on("customer:changed", () => {
  const { isValid, errors } = customer.validate();
  const data = customer.getData();

  if (data.address !== undefined) {
    formStep1.address = data.address;
  };
  if (data.payment !== undefined) {
    formStep1.payment = data.payment;
  };
  formStep1.errors = errors;
  formStep1.isValid = !!data.payment && !!data.address;

  if (data.email !== undefined) {
    formStep2.email = data.email;
  };
  if (data.phone !== undefined) {
    formStep2.phone = data.phone;
  };
  formStep2.errors = errors;
  formStep2.isValid = !!data.email && !!data.phone;
});

//далее в первой форме
events.on("order:submit", () => {
  const data = customer.getData();
  if (!data.payment || !data.address) return;
  
  modal.open(formStep2.render());
});

events.on("contacts:submit", async () => {
  const { isValid } = customer.validate();
  if (!isValid) return;
  
  try {
    const response = await webLarekApi.postOrder({
      ...(customer.getData() as IBuyer),
      total: cart.getTotalPrice(),
      items: cart.getItems().map((item) => item.id),
    });
    successWindow.total = response.total;

    successWindow.onClose = () => {
      modal.close();
    };

    modal.open(successWindow.render());
  } catch (error) {
    console.error("Ошибка оформления заказа", error);
  }
  customer.clear();
  cart.clear();
});
