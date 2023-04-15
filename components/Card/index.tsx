import Image from "next/image";
import React, { FC } from "react";
import Button from "../Button";

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
    <div className="w-[400px] h-[588px]">
      <div className="h-[455px] rounded-[20px]">{/* <Image src={''} alt="" /> */}</div>
      <div className="w-[368px] h-[197px]">
        <h5 className=" capitalize">{"d"}</h5>
        <h5 className="nft-price text-[20px] font-bold uppercase">
          {"d"}
          {"cfx"}
        </h5>
      </div>
      <div className="w-full">
        <div className="flex justify-between">
          <h4 className="font-medium text-textBlack mb-0 capitalize">{name}</h4>
          <h4 className="nft-price text-lg font-bold  mb-0">
            {price} {symbol}
          </h4>
        </div>
        <p className="text-lg font-normal text-textBlack">{user}</p>
      </div>
      <Button className="hidden text-[19px] font-medium text-white rounded-xl w-full py-4  collect-button">
        Buy it now
      </Button>
    </div>
  );
};

export default Card;
