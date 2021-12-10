import React from "react";
import Card from "../components/Card";
import AppContext from '../context'


function Favorites() {
    const { favorites, onAddToFavorite } = React.useContext(AppContext)


    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>Избранные</h1>
            </div>

            <div className="d-flex flex-wrap">
                {favorites
                    .map((item) => (
                        <Card
                            key={item.title}
                            favorited={true}
                            onFavorite={onAddToFavorite}

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

export default Favorites;
