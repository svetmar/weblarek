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
import { cloneTemplate } from "./utils/utils";
import { Modal } from "./components/view/Modal";
import { Header } from "./components/view/Header";
import { Basket } from "./components/view/Basket";
import { FormOrderStep1 } from "./components/view/Form/FormOrderStep1";
import { FormOrderStep2 } from "./components/view/Form/FormOrderStep2";
import { Success } from "./components/view/Success";
import type { IBuyer } from "./types/index";

const catalog = new ProductCatalog();
const customer = new Customer();
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);
const events = new EventEmitter();
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

const gallery = document.querySelector(".gallery") as HTMLElement;
//отрисовка галереи:
try {
  const recievedProducts = await webLarekApi.getProducts();
  catalog.setProducts(recievedProducts.items);

  const cards = recievedProducts.items.map((product) => {
    const cloneCardCatalog = cloneTemplate<HTMLElement>("#card-catalog");
    const cardCatalog = new CatalogCard(cloneCardCatalog, events);
    cardCatalog.title = product.title;
    cardCatalog.id = product.id;
    const imageUrl = new URL(
      `./images${product.image.replace(".svg", ".png")}`,
      import.meta.url,
    ).href;
    cardCatalog.image = imageUrl;
    cardCatalog.category = product.category;
    cardCatalog.price = product.price;
    return cardCatalog.render();
  });
  gallery.replaceChildren(...cards);
} catch (error) {
  console.error("Список товаров не загружен. Возникла ошибка: ", error);
}

//открытие карточки с выбранным продуктом
events.on<{ id: string }>("product:select", ({ id }) => {
  const selectedProduct = catalog.getProductById(id);
  if (selectedProduct) {
    catalog.setSelectedProduct(selectedProduct);
  } else {
    return;
  }

  const clonePreviewCard = cloneTemplate<HTMLElement>("#card-preview");
  const previewCard = new OpenedCard(clonePreviewCard, events);

  previewCard.id = selectedProduct.id;
  previewCard.description = selectedProduct.description;
  const imageURL = new URL(
    `./images${selectedProduct.image.replace(".svg", ".png")}`,
    import.meta.url,
  ).href;
  previewCard.image = imageURL;
  previewCard.title = selectedProduct.title;
  previewCard.category = selectedProduct.category;
  previewCard.price = selectedProduct.price;

  previewCard.buttonText = cart.hasItem(id) ? "Удалить из корзины" : "Купить";
  previewCard.buttonEnabled = selectedProduct.price !== null;
  modal.open(previewCard.render());
});

//добавление/удаление из корзины в карточке товара
events.on<{ id: string }>("product:toggle", ({ id }) => {
  const item = catalog.getProductById(id);
  if (!item) {
    return;
  }
  if (cart.hasItem(id)) {
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

  const basketCards = items.map((item) => {
    const basketCardEl = cloneTemplate<HTMLElement>("#card-basket");
    const basketCard = new BasketCard(events, basketCardEl);
    basketCard.title = item.title;
    basketCard.price = item.price ?? 0;
    basketCard.id = item.id;

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

//далее в первой форме
events.on("order:submit", () => {
  if (!formStep1.validate()) {
    return;
  }
  customer.update(formStep1.values);
  modal.open(formStep2.render());
});

events.on("contacts:submit", () => {
  if (!formStep2.validate()) {
    return;
  }
  customer.update(formStep2.values);
  webLarekApi.postOrder({
    ...(customer.getData() as IBuyer),
    total: cart.getTotalPrice(),
    items: cart.getItems().map((item) => item.id),
  });
  successWindow.total = cart.getTotalPrice();
  modal.open(successWindow.render());
  customer.clear();
  cart.clear();
});
