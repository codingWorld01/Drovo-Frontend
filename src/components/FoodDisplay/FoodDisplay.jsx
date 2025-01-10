import React, { useState, useEffect } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import Skeleton from 'react-loading-skeleton'; // Skeleton loader
import 'react-loading-skeleton/dist/skeleton.css';

const FoodDisplay = ({ category, foodItems, shopId }) => {
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        // Simulate loading state
        const timer = setTimeout(() => {
            setLoading(false); // Set loading to false after data is fetched
        }, 1000);

        return () => clearTimeout(timer); // Clean up timer
    }, [foodItems]);

    const filteredItems = foodItems.filter(
        (item) => category === 'ALL' || category === item.category
    );

    return (
        <div className='food-display' id='food-display'>
            <div className="food-display-list">
                {loading ? (
                    // Skeleton loaders
                    Array(6)
                        .fill(null)
                        .map((_, index) => (
                            <div key={index} className="food-item food-item-skeleton">
                                <div className="food-item-img-container">
                                    <Skeleton height={150} className="food-item-image-skeleton" />
                                    <Skeleton width={80} height={30} className="add-btn-skeleton" />
                                </div>
                                <div className="food-item-info">
                                    <div className="food-item-name-rating">
                                        <Skeleton width="70%" height={20} />
                                        <Skeleton width="30%" height={16} />
                                    </div>
                                    <Skeleton width="100%" height={14} />
                                    <Skeleton width="60%" height={20} />
                                </div>
                            </div>
                        ))
                ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <FoodItem
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                            quantity={item.quantity}
                            unit={item.unit}
                            shopId={shopId}
                        />
                    ))
                ) : (
                    <p className="no-items-message">
                        No food items available in the "{category}" category.
                    </p>
                )}
            </div>
        </div>
    );
};

export default FoodDisplay;
