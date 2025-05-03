import React, { useContext } from "react";
import { Link } from "react-router-dom"; // Fixed import

import { BsPlus, BsEyeFill } from "react-icons/bs";

// import cart context
import { CartContext } from "../contexts/CartContext.jsx";
import { CurrencyContext } from "../contexts/CurrencyContext.jsx"; // Added currency context

const Product = ({ product }) => {
	const { addToCart } = useContext(CartContext);
	const { currencySymbol } = useContext(CurrencyContext); // Get currency symbol

	// destructure product
	const { id, image, category, title, price } = product;
	return (
		<div data-testid={`product-${id}`}>
			<div className="border border-[#e4e4e4] h-[300px] mb-4 relative overflow-hidden group transition rounded-xl">
				<div className="w-full h-full flex justify-center items-center">
					{/* image */}
					<div className="w-[200px] mx-auto flex justify-center items-center">
						<img
							className="max-h-[160px] group-hover:scale-110 transition duration-300 p-4 object-contain" // Added padding and object-contain
							src={image}
							alt={title} // Added alt text
						/>
					</div>
				</div>
				{/* buttons */}
				<div className="absolute top-6 -right-11 group-hover:right-5 p-2 flex flex-col justify-center items-center gap-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
					<button
						onClick={() => addToCart(product, id)}
						aria-label={`Add ${title} to cart`} // Added aria-label
					>
						<div className="flex justify-center items-center text-white w-12 h-12 bg-cyan-500 hover:bg-cyan-600 transition cursor-pointer rounded"> {/* Added rounded */}
							<BsPlus className="text-3xl" />
						</div>
					</button>
					<Link
						to={`/product/${id}`}
						className="w-12 h-12 bg-white flex justify-center items-center text-primary drop-shadow-xl rounded hover:bg-gray-100 transition" // Added rounded
						aria-label={`View details for ${title}`} // Added aria-label
					>
						<BsEyeFill />
					</Link>
				</div>
			</div>
			{/* category, title & price */}
			<div>
				<div className="text-sm capitalize text-gray-500 mb-1">{category}</div>
				<Link to={`/product/${id}`}>
					{/* Increased max height for title and adjusted line clamp */}
					<h2 className="font-semibold mb-1 text-gray-800 hover:text-cyan-600 transition truncate h-12 line-clamp-2">
						{title}
					</h2>
				</Link>
				{/* Used currencySymbol */}
				<div className="font-semibold text-lg text-gray-900">
					{currencySymbol} {price.toFixed(2)}
				</div>
			</div>
		</div>
	);
};

export default Product;