import { ChevronDown } from "lucide-react";

const MenuItem = ({ name, price, image, flagIcon }) => {
    return (
        <div className="max-w-[180px] text-neutral-800 hover:scale-105 duration-200 hover:shadow-md rounded-lg overflow-hidden bg-white">
            <div className="relative">
                <img
                    src={"./images/food.svg"}
                    alt={name}
                    className="h-36 w-full object-cover"
                />

                {/* Price Badge */}
                <div className="absolute top-2 left-2 bg-[#252e80] text-white text-[10px] px-2 py-0.5 rounded-full">
                    AED{price}
                </div>

                {/* Flag Icon */}
                {true && (
                    <div className="absolute top-2 right-2">
                        <img
                            src={'./images/non-veg.svg'}
                            alt="Flag"
                            className="size-4 rounded-full border bg-white"
                        />
                    </div>
                )}
            </div>

            <div className="p-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-xs font-semibold ">{name}</h3>
                    <ChevronDown strokeWidth={'2.5px'} className="size-5 text-[#000080]" />
                </div>
            </div>
        </div>
    );
};

export default MenuItem;
