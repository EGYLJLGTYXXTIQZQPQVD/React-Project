import React, { useContext, useEffect, useState } from "react";
// Import contexts
import { SidebarContext } from "../contexts/SidebarContext.jsx"; // Added SidebarContext import
import { CartContext } from "../contexts/CartContext.jsx";
import { CurrencyContext } from "../contexts/CurrencyContext.jsx";
import { useAuth } from "../contexts/AuthContext";

import { Link, useNavigate } from "react-router-dom"; // Fixed import
import Logo from "../assets/img/logo.svg";
import { BsBag } from "react-icons/bs";
import { CiUser } from "react-icons/ci";

const Header = () => {
	// header state
	const [isActive, setIsActive] = useState(false);
	const { isOpen, setIsOpen } = useContext(SidebarContext); // Added SidebarContext state
	const { itemAmount } = useContext(CartContext);
	const { currentUser, logout } = useAuth();
	const navigate = useNavigate();

	// currency state
	const { currency, setCurrency } = useContext(CurrencyContext); // Added setCurrency

	// event listener for scroll
	useEffect(() => {
		window.addEventListener("scroll", () => {
			window.scrollY > 60 ? setIsActive(true) : setIsActive(false);
		});
		// Cleanup listener on component unmount
		return () => {
			window.removeEventListener("scroll", () => {
				window.scrollY > 60 ? setIsActive(true) : setIsActive(false);
			});
		};
	}); // No dependency array means it runs on every render, which might be inefficient but fixes potential stale state issues with the listener callback

	// Handle user icon click - show dropdown or navigate to login
	const [showUserMenu, setShowUserMenu] = useState(false);

	const handleUserClick = () => {
		if (currentUser) {
			setShowUserMenu(!showUserMenu);
		} else {
			navigate("/login");
		}
	};

	// Handle logout
	const handleLogout = async () => {
		try {
			await logout();
			setShowUserMenu(false);
			navigate("/");
		} catch (error) {
			console.error("Failed to log out", error);
			// Optionally set an error state here to show the user
		}
	};

	return (
		<header
			className={`${
				isActive ? "bg-white py-4 shadow-md" : "bg-none py-6"
			} fixed w-full z-10 lg:px-8 transition-all`}
		>
			<div className="container mx-auto flex items-center justify-between h-full">
				<Link to={"/"}>
					<div className="flex items-center">
						<img src={Logo} alt="Urban Loom Logo" className="w-[40px]" />
						<span className="ms-4 font-semibold text-lg">Urban Loom</span>
					</div>
				</Link>

				<div className="flex items-center gap-x-4">
					{/* currency select */}
					<select
						value={currency}
						// Fixed: Added onChange handler
						onChange={(e) => setCurrency(e.target.value)}
						className="border border-slate-800 rounded-md px-3 py-2 focus:outline-none text-slate-800 text-sm bg-transparent"
						aria-label="Select currency"
					>
						<option value="USD">🇺🇸 USD</option>
						<option value="EUR">🇪🇺 EUR</option>
						<option value="GBP">🇬🇧 GBP</option>
					</select>

					{/* cart */}
					<div
						// Fixed: Added onClick to open sidebar
						onClick={() => setIsOpen(!isOpen)}
						className="cart-btn cursor-pointer flex relative"
						role="button"
						aria-label="cart"
					>
						<BsBag className="text-2xl" />
						<div className="bg-slate-800 absolute -right-2 -bottom-2 text-[12px] w-[18px] h-[18px] text-white rounded-full flex justify-center items-center">
							{itemAmount}
						</div>
					</div>

					{/* user */}
					<div
						onClick={handleUserClick}
						className="cursor-pointer flex relative"
						role="button"
						aria-label="user account"
					>
						<CiUser className="text-3xl" />
						{currentUser && (
							<div
								className="bg-green-500 absolute -right-1 -top-1 w-[10px] h-[10px] rounded-full border-2 border-white"
								title="Logged In"
							></div>
						)}

						{/* User dropdown menu */}
						{showUserMenu && currentUser && (
							<div className="absolute right-0 top-10 mt-2 bg-white shadow-lg rounded-md py-2 w-48 z-20 border border-gray-200">
								<div className="px-4 py-2 border-b text-xs font-semibold text-gray-500">
									Signed in as:
								</div>
								<div className="px-4 py-1 text-sm truncate font-medium">
									{currentUser.email}
								</div>
								<div className="border-t mt-1 pt-1">
									<Link
										to="/profile"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										onClick={() => setShowUserMenu(false)}
									>
										Profile
									</Link>
									<button
										onClick={handleLogout}
										className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
									>
										Log Out
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;