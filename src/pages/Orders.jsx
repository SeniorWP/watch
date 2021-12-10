import React from "react";
import axios from "axios";
import Card from "../components/Card";



function Orders() {
    // const { onAddToFavorite, onAddToCart } = React.useContext(AppContext)
    const [orders, setOrders] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    React.useEffect(() => {
        // Рукурсивный вызов функции
        (async () => {
            try {
                const { data } = await axios.get('https://61aa3215bfb110001773f127.mockapi.io/orders')
                setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []))
                setIsLoading(false)
            } catch (error) {
                alert('Ошибка')
                console.error(error)
            }
        })();

    }, []);

    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>Мои заказы</h1>
            </div>

            <div className="d-flex flex-wrap">
                {(isLoading ? [...Array(8)] : orders)
                    .map((item, index) => (
                        <Card
                            key={index}
                            loading={isLoading}
                            {...item}

                        // в item хранится
                        //  title={item.title}
                        // price={item.price}
                        // imageUrl={item.imageUrl} + id который мы не передали
                        />
                    ))}
            </div>
        </div>
    )
}

export default Orders;
