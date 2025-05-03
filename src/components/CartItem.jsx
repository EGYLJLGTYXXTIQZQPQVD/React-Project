import React, { useContext } from "react";
import { Link } from "react-router-dom"; // Ensure this is react-router-dom

import { IoMdAdd, IoMdClose, IoMdRemove } from "react-icons/io";

import { CartContext } from "../contexts/CartContext.jsx";
import { CurrencyContext } from "../contexts/CurrencyContext.jsx"; // Import CurrencyContext

const CartItem = ({ item }) => {
	const { removeFromCart, increaseAmount, decreaseAmount } =
		useContext(CartContext);
	const { currencySymbol } = useContext(CurrencyContext); // Get the dynamic currency symbol
	// destructure item
	const { id, title, image, price, amount } = item;

	// Ensure price is treated as a number
	const numericPrice = Number(price) || 0;
	const numericAmount = Number(amount) || 0;

	return (
		<div className="flex gap-x-4 py-2 lg:px-6 border-b border-gray-200 w-full font-light text-gray-500">
			<div className="w-full min-h-[150px] flex items-center gap-x-4">
				{/* image */}
				<Link to={`/product/${id}`}>
					<img
						className="max-w-[80px] object-contain" // Added object-contain
						src={image}
						alt={title} // Added alt text
					/>
				</Link>
				<div className="w-full flex flex-col">
					{/* title and remove icon */}
					<div className="flex justify-between mb-2">
						{/* title */}
						<Link
							to={`/product/${id}`}
							className="text-sm uppercase font-medium max-w-[240px] text-primary hover:underline"
						>
							{title}
						</Link>
						{/* remove icon */}
						<div
							onClick={() => removeFromCart(id)}
							className="text-xl cursor-pointer"
							role="button"
							aria-label={`Remove ${title} from cart`}
						>
							<IoMdClose className="text-gray-500 hover:text-red-500 transition" />
						</div>
					</div>
					<div className="flex gap-x-2 h-[36px] text-sm">
						{/* quantity */}
						<div className="flex flex-1 max-w-[100px] items-center h-full border text-primary font-medium">
							{/* minus icon */}
							<div
								onClick={() => decreaseAmount(id)}
								className="h-full flex-1 flex justify-center items-center cursor-pointer hover:bg-gray-100 transition"
								role="button"
								aria-label={`Decrease quantity of ${title}`}
							>
								<IoMdRemove />
							</div>
							{/* amount */}
							<div
								className="h-full flex justify-center items-center px-2"
								aria-live="polite" // Announce quantity changes
							>
								{numericAmount}
							</div>
							{/* plus icon */}
							<div
								onClick={() => increaseAmount(id)}
								className="h-full flex flex-1 justify-center items-center cursor-pointer hover:bg-gray-100 transition"
								role="button"
								aria-label={`Increase quantity of ${title}`}
							>
								<IoMdAdd />
							</div>
						</div>
						{/* item price */}
						<div className="flex flex-1 justify-around items-center">
							{currencySymbol} {numericPrice.toFixed(2)}{" "}
							{/* Use dynamic symbol and ensure price is number */}
						</div>
						{/* final price */}
						<div className="flex flex-1 justify-end items-center text-primary font-medium">
							{/* Use dynamic symbol and ensure calculation uses numbers */}
							{`${currencySymbol} ${parseFloat(
								numericPrice * numericAmount
							).toFixed(2)}`}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartItem;