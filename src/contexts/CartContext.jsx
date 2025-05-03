import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
	// cart state
	const [cart, setCart] = useState([]);
	// item amount state
	const [itemAmount, setItemAmount] = useState(0);
	// total price state
	const [total, setTotal] = useState(0);

	// Load cart from local storage on initial render
	useEffect(() => {
		const savedCart = localStorage.getItem("cart");
		if (savedCart) {
			setCart(JSON.parse(savedCart));
		}
	}, []);

	// Save cart to local storage whenever it changes
	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cart));
	}, [cart]);

	useEffect(() => {
		const newTotal = cart.reduce((accumulator, currentItem) => {
			// Fixed total calculation: price * amount
			return accumulator + currentItem.price * currentItem.amount;
		}, 0);
		setTotal(newTotal);
	}, [cart]);

	// update item amount count (total number of items)
	useEffect(() => {
		if (cart) {
			const amount = cart.reduce((accumulator, currentItem) => {
				return accumulator + currentItem.amount;
			}, 0);
			setItemAmount(amount);
		} else {
			setItemAmount(0); // Ensure amount is 0 if cart is empty/null
		}
	}, [cart]);

	// add to cart
	const addToCart = (product, id) => {
		// Fixed: New item starts with amount 1
		const newItem = { ...product, amount: 1 };
		// check if the item is already in the cart
		const cartItem = cart.find((item) => {
			return item.id === id;
		});
		if (cartItem) {
			const newCart = [...cart].map((item) => {
				if (item.id === id) {
					// Fixed: Increment existing item amount
					return { ...item, amount: item.amount + 1 };
				} else return item;
			});
			setCart(newCart);
		} else {
			setCart([...cart, newItem]);
		}
	};

	// remove from cart
	const removeFromCart = (id) => {
		const newCart = cart.filter((item) => {
			return item.id !== id;
		});
		setCart(newCart);
	};

	// clear cart
	const clearCart = () => {
		setCart([]);
	};

	// increase amount (re-use addToCart logic which now increments)
	const increaseAmount = (id) => {
		const cartItem = cart.find((item) => item.id === id);
		if (cartItem) {
			addToCart(cartItem, id); // This will correctly increment the amount
		}
	};

	// decrease amount - Fixed Implementation
	const decreaseAmount = (id) => {
		const cartItemIndex = cart.findIndex((item) => item.id === id);

		if (cartItemIndex > -1) {
			const newCart = [...cart];
			const cartItem = newCart[cartItemIndex];

			if (cartItem.amount > 1) {
				// Decrease amount if more than 1
				newCart[cartItemIndex] = { ...cartItem, amount: cartItem.amount - 1 };
				setCart(newCart);
			} else {
				// Remove item if amount is 1
				removeFromCart(id);
			}
		}
	};

	return (
		<CartContext.Provider
			value={{
				cart,
				addToCart,
				removeFromCart,
				clearCart,
				increaseAmount,
				decreaseAmount, // Make sure decreaseAmount is provided
				itemAmount,
				total,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export default CartProvider;