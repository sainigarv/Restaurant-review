const RestaurantCard = ({ name, rating, reviewCount, imageUrl, onAddReview }) => (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 group custom-cursor relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative overflow-hidden rounded-xl mb-4">
            <img
                src={imageUrl}
                alt="Restaurant interior"
                className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">{name}</h2>
        <div className="flex items-center mt-3">
            <div className="flex text-yellow-400 drop-shadow-sm text-lg">
                {"★".repeat(rating)}{"☆".repeat(5 - rating)}
            </div>
            <span className="ml-2 text-gray-600 font-semibold">({rating}.0)</span>
        </div>
        <p className="mt-2 text-gray-600 font-medium tracking-wide">{reviewCount} reviews</p>
        <button 
            onClick={onAddReview}
            className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl w-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 custom-cursor relative overflow-hidden group"
        >
            <span className="relative z-10">Add Review</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </button>
    </div>
);

export default RestaurantCard;