import React, { useContext } from "react";

// import link
import { Link, useNavigate } from "react-router-dom"; // Fixed import

// import icons
import { IoMdArrowForward } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";

// import components
import CartItem from "./CartItem";
// import sidebar context
import { SidebarContext } from "../contexts/SidebarContext.jsx";
// import cart context
import { CartContext } from "../contexts/CartContext.jsx";
// import currency context
import { CurrencyContext } from "../contexts/CurrencyContext.jsx";

const Sidebar = () => {
	const navigate = useNavigate();
	const { isOpen, handleClose } = useContext(SidebarContext);
	// Fixed: Added clearCart
	const { cart, clearCart, itemAmount, total } = useContext(CartContext);
	const { currencySymbol } = useContext(CurrencyContext);

	const handleCheckout = () => {
		// This logic seems fine, navigates to the checkout page
		if (cart.length === 0) {
			alert(
				"Your cart is empty. Please add items to your cart before checking out."
			);
			return;
		}
		handleClose(); // Close sidebar on checkout
		navigate("/checkout");
	};

	return (
		<div
			className={`${
				isOpen ? "right-0" : "-right-full"
			} w-full bg-white fixed top-0 h-full shadow-2xl md:w-[35vw] lg:w-[40vw] xl:max-w-[30vw] transition-all duration-300 z-20 px-4 lg:px-[35px] flex flex-col`} // Added flex flex-col
			data-testid="sidebar"
		>
			<div className="flex items-center justify-between py-6 border-b">
				<div className="uppercase text-sm font-semibold">
					Shopping Bag ({itemAmount})
				</div>
				{/* icon */}
				<div
					onClick={handleClose}
					className="cursor-pointer w-8 h-8 flex justify-center items-center" // Corrected: cursor-pointer
					role="button"
					aria-label="Close cart sidebar"
				>
					<IoMdArrowForward className="text-2xl" />
				</div>
			</div>
			{/* Cart Items */}
			<div
				className={`flex-grow overflow-y-auto overflow-x-hidden border-b ${
					cart.length === 0 ? "flex items-center justify-center" : ""
				}`} // Added flex grow and centering for empty state
			>
				{cart.length > 0 ? (
					cart.map((item) => {
						return <CartItem item={item} key={item.id} />;
					})
				) : (
					<div className="text-center text-gray-500 py-10">
						Your cart is empty.
					</div>
				)}
			</div>
			{/* Footer section only if cart has items */}
			{cart.length > 0 && (
				<div className="flex flex-col gap-y-3 py-4 mt-auto">
					{" "}
					{/* Use mt-auto to push footer down */}
					<div className="flex w-full justify-between items-center">
						{/* total */}
						<div className="uppercase font-semibold">
							<span className="mr-2">Total:</span>{" "}
							{`${currencySymbol} ${parseFloat(total).toFixed(2)}`}
						</div>
						{/* clear cart icon */}
						<div
							// Fixed: Added onClick handler for clearCart
							onClick={clearCart}
							className="clear-cart-btn cursor-pointer py-4 bg-red-500 text-white w-12 h-12 flex justify-center items-center text-xl rounded" // Added rounded
							role="button"
							aria-label="Clear cart"
						>
							<FiTrash2 />
						</div>
					</div>
					{/* View Cart Link - Optional but good UX */}
					{/* <Link
						to="/cart" // Assuming you might have a dedicated cart page later
						className="bg-gray-200 flex p-3 justify-center items-center text-primary w-full font-medium"
						onClick={handleClose}
					>
						View cart
					</Link> */}
					<button
						type="button"
						role="button"
						aria-label="checkout"
						onClick={handleCheckout}
						className="bg-black flex p-3 justify-center items-center text-white w-full font-medium cursor-pointer hover:bg-gray-800 transition rounded" // Added rounded
					>
						Checkout
					</button>
				</div>
			)}
		</div>
	);
};

export default Sidebar;