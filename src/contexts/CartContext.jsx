import React, { createContext, useState, useEffect, useMemo } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
	// Initialize state from localStorage or default to empty array
	const [cart, setCart] = useState(() => {
		try {
			// Ensure localStorage access is safe (e.g., not in SSR)
			if (typeof window !== 'undefined' && window.localStorage) {
				const savedCart = localStorage.getItem("cart");
				return savedCart ? JSON.parse(savedCart) : [];
			}
			return [];
		} catch (error) {
			console.error("Failed to parse cart from localStorage", error);
			return [];
		}
	});

	// Save cart to local storage whenever it changes
	useEffect(() => {
		try {
			if (typeof window !== 'undefined' && window.localStorage) {
				localStorage.setItem("cart", JSON.stringify(cart));
			}
		} catch (error) {
			console.error("Failed to save cart to localStorage", error);
		}
	}, [cart]);

	// --- Calculate derived state directly ---
	const itemAmount = useMemo(() => {
		return cart.reduce((accumulator, currentItem) => {
			return accumulator + (Number(currentItem.amount) || 0);
		}, 0);
	}, [cart]);

	const total = useMemo(() => {
		return cart.reduce((accumulator, currentItem) => {
			const price = Number(currentItem.price) || 0;
			const amount = Number(currentItem.amount) || 0;
			return accumulator + price * amount;
		}, 0);
	}, [cart]);
	// --- End derived state calculation ---


	// add to cart
	const addToCart = (product, id) => {
		// Ensure product exists and has necessary fields
		if (!product || typeof product.price === 'undefined') {
			console.error("Attempted to add invalid product:", product);
			return; // Prevent adding invalid items
		}

		const productId = String(id); // Normalize ID to string
		const currentPrice = Number(product.price) || 0; // Ensure price is a number

		setCart(prevCart => {
			const cartItemIndex = prevCart.findIndex((item) => String(item.id) === productId);

			if (cartItemIndex > -1) {
				// Item exists, increment amount
				const newCart = [...prevCart];
				newCart[cartItemIndex] = {
					...newCart[cartItemIndex],
					amount: (Number(newCart[cartItemIndex].amount) || 0) + 1,
				};
				return newCart;
			} else {
				// Item doesn't exist, add as new item
				const newItem = {
					...product,
					id: productId, // Ensure ID in the cart is also string
					amount: 1,
					price: currentPrice, // Use sanitized price
				};
				return [...prevCart, newItem];
			}
		});
	};

	// remove from cart
	const removeFromCart = (id) => {
		const productId = String(id); // Normalize ID
		setCart(prevCart => prevCart.filter((item) => String(item.id) !== productId));
	};

	// clear cart
	const clearCart = () => {
		setCart([]);
	};

	// increase amount
	const increaseAmount = (id) => {
		const productId = String(id); // Normalize ID
		setCart(prevCart => {
			const cartItemIndex = prevCart.findIndex((item) => String(item.id) === productId);
			if (cartItemIndex > -1) {
				const newCart = [...prevCart];
				newCart[cartItemIndex] = {
					...newCart[cartItemIndex],
					amount: (Number(newCart[cartItemIndex].amount) || 0) + 1,
				};
				return newCart;
			}
			return prevCart; // Return unchanged cart if item not found
		});
	};

	// decrease amount
	const decreaseAmount = (id) => {
		const productId = String(id); // Normalize ID
		setCart(prevCart => {
			const cartItemIndex = prevCart.findIndex((item) => String(item.id) === productId);

			if (cartItemIndex > -1) {
				const currentAmount = Number(prevCart[cartItemIndex].amount) || 0;
				if (currentAmount > 1) {
					// Decrease amount if more than 1
					const newCart = [...prevCart];
					newCart[cartItemIndex] = { ...newCart[cartItemIndex], amount: currentAmount - 1 };
					return newCart;
				} else {
					// Remove item if amount is 1 or less
					return prevCart.filter((item) => String(item.id) !== productId);
				}
			}
			return prevCart; // Return unchanged cart if item not found
		});
	};

	// Memoize the context value to prevent unnecessary re-renders of consumers
    const contextValue = useMemo(() => ({
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseAmount,
        decreaseAmount,
        itemAmount,
        total,
    }), [cart, itemAmount, total]); // Dependencies include derived states

	return (
		// <CartContext.Provider value={{ ... }}> // Original way
		<CartContext.Provider value={contextValue}> {/* Use memoized value */}
			{children}
		</CartContext.Provider>
	);
};

export default CartProvider;