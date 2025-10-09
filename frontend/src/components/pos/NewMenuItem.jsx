import { Minus, Plus } from "lucide-react";

const NewMenuItem = ({ name, price, image, flagIcon }) => {
    return (
        <div className="flex relative justify-between border hover:scale-105 duration-200 hover:shadow-md rounded-lg bg-white shadow-sm max-w-[240px]">
            {/* Left: Image with flag */}
            <div className="relative">
                <img
                    src={"./images/food.svg"}
                    alt={name}
                    className="h-[105px] w-[105px] object-center rounded-md"
                />

                {/* Flag Icon */}
                <div className="absolute top-1 left-1">
                    <img
                        src={'./images/non-veg.svg'}
                        alt="Flag"
                        className="size-5 rounded-sm border bg-white"
                    />
                </div>
            </div>

            {/* Middle: Item Info */}
            <div className="flex flex-col ml-2 mt-3"> 
                <h3 className="text-md font-semibold text-gray-800">{name}</h3>
                <span className="text-[12px] text-gray-500 pe-2">
                    Hello this is description It's delicious
                </span>
            </div>

            {/* Right: Price */}
            <div className="absolute bottom-0 right-0">
                <span className="bg-[#252e80] text-white text-xs font-semibold px-3 py-1 rounded-tl-lg rounded-br-lg">
                    AED {price}
                </span>
            </div>
        </div>
    );
};

export default NewMenuItem;
