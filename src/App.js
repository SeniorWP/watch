import React from 'react';
import axios from 'axios';
import { Route, Routes } from "react-router-dom";

import AppContext from './context';

import Header from './components/Header';
import Drawer from './components/Drawer';

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders'


function App() {
  // кросовки
  const [items, setItems] = React.useState([]);
  // кросовки в корзине
  const [cartItems, setCartItems] = React.useState([]);
  // поиск кросовок 
  const [searchValue, setSearchValue] = React.useState('');
  // состояние drawe открыто / закрыто
  const [cartOpened, setCartOpened] = React.useState(false);
  // Избранные 
  const [favorites, setFavorites] = React.useState([]);
  // Фейковая загрузка
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {

    async function fetchData() {
      try {
        const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
          axios.get('https://61aa3215bfb110001773f127.mockapi.io/cart'),
          axios.get('https://61aa3215bfb110001773f127.mockapi.io/favorites'),
          axios.get('https://61aa3215bfb110001773f127.mockapi.io/items')
        ])

        setIsLoading(false)
        setCartItems(cartResponse.data)
        setFavorites(favoritesResponse.data)
        setItems(itemsResponse.data)

      } catch (error) {
        alert('Ошибка при запросе данных')
        console.error(error);
      }

    }
    fetchData()
  }, []);

  // Добавляем кросовки в drawer, prev-предыдущие данные
  const onAddToCart = async (obj) => {
    const findItem = cartItems.find(item => Number(item.parentId) === Number(obj.id))
    try {
      if (findItem) {
        setCartItems(prev => (prev.filter(item => Number(item.parentId) !== Number(obj.id))))
        await axios.delete(`https://61aa3215bfb110001773f127.mockapi.io/cart/${findItem.id}`);
      } else {
        setCartItems(prev => [...prev, obj]);
        const { data } = await axios.post('https://61aa3215bfb110001773f127.mockapi.io/cart', obj);
        setCartItems(prev => prev.map((item) => {
          if (item.parentId === data.parentId) {
            return {
              ...item,
              id: data.id
            }
          }
          return item
        }));
      }
    } catch (error) {
      alert('Ошибка при добавлении в корзину')
      console.error(error);
    }
  };

  // Добавляем и удаляем избранные в корзину 
  const onAddToFavorite = async (obj) => {
    // Блок на повторное добавление в избранные на нажатие избранные
    // Всегда оборачиваем async в tryCatch для отловы ошибки, иначе ошибку мы не отловим!!!
    try {
      if (favorites.find(favObj => Number(favObj.id) === Number(obj.id))) {
        axios.delete(`https://61aa3215bfb110001773f127.mockapi.io/favorites/${obj.id}`);
        setFavorites(prev => (prev.filter(item => Number(item.id) !== Number(obj.id))))
      } else {
        const { data } = await axios.post('https://61aa3215bfb110001773f127.mockapi.io/favorites', obj);
        setFavorites(prev => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты')
      console.error(error);
    }

  };

  // Удаление товара из корзины
  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://61aa3215bfb110001773f127.mockapi.io/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
    } catch (error) {
      alert('Не удалось удалить из корзины')
      console.error(error);
    }
  };

  // Получение данных из input
  const onChangeSeacrhInput = (e) => {
    setSearchValue(e.target.value);
  }

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id))
  }

  return (
    <AppContext.Provider value={{ items, cartItems, favorites, isItemAdded, onAddToFavorite, setCartOpened, setCartItems, onAddToCart }}>
      <div className="wrapper clear">
        <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem} opened={cartOpened} />
        <Header onClickCart={() => setCartOpened(true)} />
        <Routes>
          <Route path="/" element={<Home
            items={items}
            cartItems={cartItems}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onChangeSeacrhInput={onChangeSeacrhInput}
            onAddToFavorite={onAddToFavorite}
            onAddToCart={onAddToCart}
            isLoading={isLoading}
          />} exact>
          </Route>
          <Route path="/favorites" element={<Favorites />} exact></Route>
          <Route path="/orders" element={<Orders />} exact></Route>
        </Routes>



      </div>
    </AppContext.Provider>
  );
}

export default App;
