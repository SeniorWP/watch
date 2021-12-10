import React from "react";
import axios from "axios";
import Info from "../Info";

import { useCart } from '../hooks/useCart'

import styles from './Drawer.module.scss'

// Опция на задержку запросы на мок апи что бы он не забанил ( костыль:( )
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function Drawer({ onClose, items = [], onRemove, opened }) {
  const { cartItems, setCartItems, totalPrice } = useCart()
  const [isOrderComplete, setIsOrderComplete] = React.useState(false)
  const [orderId, setOrderId] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)



  const onClickOrder = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.post('https://61aa3215bfb110001773f127.mockapi.io/orders', { items: cartItems });
      setOrderId(data.id);
      setIsOrderComplete(true);
      setCartItems([]);


      // Костыль для удаления товара из корзины после оформления заказа
      // Так как мок апи не делает реплейса
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete('https://61aa3215bfb110001773f127.mockapi.io/cart/' + item.id)
        await delay(1000)
      }

    } catch (error) {
      alert('ОШибка при создании заказа :(');
    }
    setIsLoading(false);
  };

  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
      <div className={styles.drawer}>
        <h2 className="d-flex justify-between mb-30">
          Корзина <img onClick={onClose} className="cu-p" src="/img/btn-remove.svg" alt="Close" />
        </h2>

        {
          items.length > 0 ?
            <div className="d-flex flex-column flex">
              <div className="items flex">
                {items.map((obj) => (
                  <div key={obj.id} className="cartItem d-flex align-center mb-20">
                    <div
                      style={{ backgroundImage: `url(${obj.imageUrl})` }}
                      className="cartItemImg"></div>

                    <div className="mr-20 flex">
                      <p className="mb-5">{obj.title}</p>
                      <b>{obj.price} руб.</b>
                    </div>
                    <img className="removeBtn" src="/img/btn-remove.svg" alt="Remove" onClick={() => onRemove(obj.id)} />
                  </div>
                ))}
              </div>

              <div className="cartTotalBlock">
                <ul>
                  <li>
                    <span>Итого:</span>
                    <div></div>
                    <b>{totalPrice} руб. </b>
                  </li>
                  <li>
                    <span>НДС:</span>
                    <div></div>
                    <b>{totalPrice * 0.2} руб. </b>
                  </li>
                </ul>
                <button disabled={isLoading} onClick={onClickOrder} className="greenButton">
                  Оформить заказ <img src="/img/arrow.svg" alt="Arrow" />
                </button>
              </div></div>
            :
            <Info
              title={isOrderComplete ? "Заказ оформлен" : "Пустая корзина"}
              description={isOrderComplete ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке` : "Добавьте хотя бы одну пару кросовок, что бы сделать заказ."}
              image={isOrderComplete ? "/img/8.jpg" : "/img/empty-cart.jpg"}
            />
        }
      </div>
    </div>
  );
}

export default Drawer;
