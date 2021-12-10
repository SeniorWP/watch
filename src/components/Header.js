import React from "react";
import { Link } from "react-router-dom";
import { useCart } from './hooks/useCart'

function Header(props) {
  const { totalPrice } = useCart()


  return (
    <header className="d-flex justify-between align-center p-20">
      <Link to="/">
        <div className="d-flex align-center">
          <img width={70} height={60} src="/img/logo2.png" alt="logo" />
          <div>
            <h3 className="text-uppercase">G-Shock</h3>
            <p className="opacity-8 text-uppercase">absolute tougness</p>
          </div>
        </div>
      </Link>

      <ul className="d-flex">
        <li onClick={props.onClickCart} className="mr-30 cu-p">

          <img width={18} height={18} src="/img/cart.svg" alt="корзина" />
          <span>{totalPrice} руб.</span>
        </li>
        <li className="mr-20 cu-p">
          <Link to="/favorites">
            <img width={21} height={18} src="/img/heart.svg" alt="закладки" />
          </Link>
        </li>
        <li>
          <Link to="/orders">
            <img width={21} height={18} src="/img/user.svg" alt="пользователь" />
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default Header;
