"use client";

import { UserCircle } from "lucide-react";
import HyperText from "./ui/hyper-text";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const Navbar = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check login status whenever component mounts or token changes
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = Cookies.get('token');
            setIsLoggedIn(!!token);
        };

        // Initial check
        checkLoginStatus();

        // Set up interval to check periodically
        const interval = setInterval(checkLoginStatus, 1000);

        // Clean up interval on unmount
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        setIsLoggedIn(false);
        router.push('/login');
    };

    return (
        <nav className="flex fixed w-full justify-between items-center p-4 z-50 bg-white/70 backdrop-blur-md">
            <div className="logo font-bold text-xl">
                <Link href="/">
                    <HyperText text={"Bite-Check"} className={"hover:cursor-pointer"} />
                </Link>
            </div>
            <ul className="list-items flex gap-4 items-center hidden md:flex">
                <Link href="/reviews">
                    <HyperText className={"text-xl hover:cursor-pointer"} text={"Find & Review"} />
                </Link>
                <span className="text-gray-500">/</span>

                <Link href="/restaurant-dashboard">
                    <HyperText className={"text-xl hover:cursor-pointer"} text={"Restaurant Portal"} />
                </Link>
                <span className="text-gray-500">/</span>

                <Link href="/about">
                    <HyperText className={"text-xl hover:cursor-pointer"} text={"About"} />
                </Link>
            </ul>
            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <HyperText text={"Logout"} />
                    </button>
                ) : (
                    <Link href="/login">
                        <div className="px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            <HyperText text={"Login"} />
                        </div>
                    </Link>
                )}
                <Link href="/profile" className="hover:cursor-pointer">
                    <UserCircle size={24} />
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;