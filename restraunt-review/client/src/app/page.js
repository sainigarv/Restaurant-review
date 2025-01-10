import Image from "next/image";
import HyperText from "../components/ui/hyper-text";
import Food from "./3D_Models/food";
import Robot from "./3D_Models/robot";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 h-screen w-screen z-0">
        <Robot />
      </div>
      <div className="text-center space-y-4 z-10 bg-white/80 p-8 rounded-lg backdrop-blur-sm">
        <div className="w-full flex justify-center">
          <HyperText
            text="Welcome to Bite-Check"
            className="text-5xl font-bold text-black"
          />
        </div>
        <p className="text-xl text-gray-800 max-w-2xl mx-auto">
          Your trusted platform for discovering and reviewing local restaurants.
          Share your dining experiences and help others find their next favorite
          spot.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <a
            href="/reviews"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <HyperText text="Start Exploring" />
          </a>
          <a
            href="/restaurant-dashboard"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
          >
            <HyperText text="Restaurant Portal" />
          </a>
        </div>
      </div>
    </main>
  );
}
