import { ChevronDown } from "lucide-react";

const OldMenuItem = ({ name, price, image, flagIcon, onClick,variations }) => {
    return (
        <div onClick={onClick} role="button" tabIndex={0} className="cursor-pointer max-w-[180px] text-neutral-800 hover:scale-105 duration-200 hover:shadow-lg rounded-xl overflow-hidden bg-white border border-gray-100">
            <div className="relative">
                <img
                    src={"./images/food.svg"}
                    alt={name}
                    className="h-40 w-full object-center"
                />

                {/* Flag Icon - More prominent */}
                {true && (
                    <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-sm">
                        <img
                            src={'./images/non-veg.svg'}
                            alt="Dietary indicator"
                            className="size-5"
                        />
                    </div>
                )}
            </div>

            <div className="p-3">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-semibold leading-tight">{name}</h3>
                </div>
                {  variations && variations.length > 0 ?
                    <div className="flex justify-between  gap-2 mt-1" >
                    <span className="text-xs text-gray-400">Show Variations </span>
                    <ChevronDown strokeWidth={'2.5px'} className="size-3 text-[#000080] flex-shrink-0 mt-0.5" />
                </div> :
                <div className="mt-2  font-bold text-[16px]">
                    AED{price}
                </div>}
            </div>
        </div>
    );
};

export default OldMenuItem;