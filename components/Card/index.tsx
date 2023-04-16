import Image from "next/image";
import React, { FC } from "react";
import Button from "../Button";
import userIcon from "../../public/images/user-icon.png";

interface ICardProps {
  name: string | number | null | undefined;
  price: string | number | null | undefined;
  symbol: string;
  user: string;
  image: string | null | undefined;
  onClick: () => void;
}

const Card: FC<ICardProps> = ({ name, image, price, symbol, user, onClick }) => {
  return (
    <div className="w-[300px] h-[588px]" onClick={onClick}>
      <div className="">
        {image && (
          <img src={image} alt="" className="w-[300px] h-[400px] rounded-[20px] object-cover" />
        )}
      </div>
      <div className="flex justify-center relative bottom-[75px]">
        <div className="w-[270px] h-[165px] bg-[#F2F2F2] rounded-3xl p-4 flex flex-col justify-between">
          <div className="flex justify-between gap-4">
            <h5 className=" capitalize font-extrabold text-textBlack">
              {"Lighting Axe"}
            </h5>
            <h5 className="nft-price text-[18px] font-extrabold uppercase">
              {"100 "}
              {"cfx"}
            </h5>
          </div>
          <div className="flex gap-[10px] items-center">
            <Image
              src={userIcon}
              alt="marketplan"
              className="w-9 h-9 rounded-full object-contain"
            />
            <h3 className="capitalize text-xl font-medium text-textBlack">{"Loura chin"}</h3>
          </div>
          <Button>
            Buy it now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
