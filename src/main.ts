import './scss/styles.scss';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Customer } from './components/Models/Customer';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { WebLarekApi } from './components/base/WebLarekApi';

const catalog = new ProductCatalog();
catalog.setProducts(apiProducts.items);
console.log('Массив товаров из каталога: ', catalog.getProducts());
console.log('Продукт по id: ', catalog.getProductById('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));
catalog.setSelectedProduct({
            "id": "412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
            "description": "Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.",
            "image": "/Soft_Flower.svg",
            "title": "Фреймворк куки судьбы",
            "category": "дополнительное",
            "price": 2500
        });
console.log('Выбранный продукт: ', catalog.getSelectedProduct());

const cart = new Cart();
cart.addItem({
            "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
            "description": "Если планируете решать задачи в тренажёре, берите два.",
            "image": "/5_Dots.svg",
            "title": "+1 час в сутках",
            "category": "софт-скил",
            "price": 750
        });
cart.addItem({
            "id": "412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
            "description": "Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.",
            "image": "/Soft_Flower.svg",
            "title": "Фреймворк куки судьбы",
            "category": "дополнительное",
            "price": 2500
        });
console.log('Товары в корзине: ', cart.getItems());
console.log('Количество товаров в корзине: ', cart.getTotalQuantity());
console.log('Цена товаров в корзине: ', cart.getTotalPrice());
console.log('Есть ли куки судьбы в корзине?: ', cart.hasItem("412bcf81-7e75-4e70-bdb9-d3c73c9803b7"));
cart.removeItem({
            "id": "412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
            "description": "Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.",
            "image": "/Soft_Flower.svg",
            "title": "Фреймворк куки судьбы",
            "category": "дополнительное",
            "price": 2500
        });
console.log('Удалили куки судьбы, остался только +1 час ', cart.getItems());
cart.clear();
console.log('Очистили корзину - теперь в ней ничего нет ', cart.getItems());

const customer = new Customer();
customer.update({
  payment: 'card',
  
  phone: '1234567890',
  address: 'California',
} );
console.log('Данные о покупателе ', customer.getData());
customer.update({address: 'Michigan'});
console.log('Поменяли адрес на Мичиган ', customer.getData());
console.log('Проверка корректности данных ', customer.validate());
customer.clear();
console.log('Удалили все данные ', customer.getData());

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);
try {
    const recievedProducts = await webLarekApi.getProducts();
    catalog.setProducts(recievedProducts.items);
    console.log('Массив товаров с сервера: ', catalog.getProducts());
}
catch(error) {
    console.error('Список товаров не загружен. Возникла ошибка: ', error)
}
