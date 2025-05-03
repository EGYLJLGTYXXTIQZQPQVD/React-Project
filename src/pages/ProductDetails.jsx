import React, { useContext } from "react";
import { useParams } from "react-router-dom"; // Fixed import

// import contexts
import { CartContext } from "../contexts/CartContext.jsx";
import { ProductContext } from "../contexts/ProductContext.jsx";

const ProductDetails = () => {
	// get the product id from url
	const { id } = useParams();
	const { products } = useContext(ProductContext);
	const { addToCart } = useContext(CartContext); // Added CartContext

	//get the single product based on id
	// Fixed: Use find() and handle potential string/number difference
	const product = products.find((item) => {
		// Use == for type coercion just in case API ID is number and param is string
		return item.id == id;
	});

	// if product is not found
	if (!product) {
		return (
			<section className="h-screen flex justify-center items-center">
				Loading...
			</section>
		);
	}

	// destructure product
	const { title, price, description, image } = product;
	return (
		<section
			className="pt-[450px] md:pt-32 pb-[400px] md:pb-12 lg:py-32 min-h-screen flex items-center" // Use min-h-screen instead of h-screen for flexibility
			data-testid="product-details"
		>
			<div className="container mx-auto">
				{/* image and text wrapper */}
				<div className="flex flex-col lg:flex-row items-center">
					{/* image */}
					<div className="flex flex-1 justify-center items-center mb-8 lg:mb-0">
						<img className="max-w-[200px] lg:max-w-xs" src={image} alt="" />
					</div>
					{/* text */}
					<div className="flex-1 text-center lg:text-left">
						<h1 className="text-[26px] font-medium mb-2 max-w-[450px] mx-auto lg:mx-0">
							{title}
						</h1>
						<div className="text-2xl text-red-500 font-medium mb-6">
							$ {price}
						</div>
						<p className="mb-8">{description}</p>
						{/* Fixed: Added onClick handler */}
						<button
							onClick={() => addToCart(product, product.id)}
							className="bg-black py-4 px-8 text-white hover:bg-gray-800 transition"
						>
							Add to cart
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ProductDetails;