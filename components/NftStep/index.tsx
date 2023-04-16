import Image from "next/image";
import React, { FC } from "react";
import image1 from "../../public/images/creator-image.png";
import leftImage from "../../public/images/left-card-gradient.png";
import bottomImage from "../../public/images/bottom-card-gradient.png";

interface INftStepProps {
  step: string;
  title: string;
  description: string;
}

const NftStep: FC<INftStepProps> = ({ step, title, description }) => {
  return (
    <div>
      <div className="nft-step-box relative w-[174px] h-[400px] border border-[#696969] rounded-[20px] flex flex-col items-center cursor-default hover:border-[2px]">
        <p className="nft-step-count text-purple text-[40px] font-bold h-[25%] w-full flex justify-center items-center">
          {step}.
        </p>
        <div className="nft-step-line w-full flex justify-center">
          <div className="h-[1px] bg-[#5F5E5F] w-[88%]"></div>
        </div>
        <div className="nft-step-title h-[75%]">
          <p className="nft-step-name text-2xl font-semibold text-white flex justify-center items-center">
            {title}
          </p>
          <p className="nft-step-description w-[80%] font-semibold hidden">{description}</p>
          <Image
            src={image1}
            alt={description}
            className="nft-step-image hidden rounded-2xl w-full object-cover"
          />
        </div>
        {/* <Image src={leftImage} alt={title} className="nft-trans-left-img hidden absolute left-0 top-0 " />
        <Image src={bottomImage} alt={title} className="nft-trans-bottom-img hidden absolute left-0 bottom-0" /> */}
      </div>
    </div>
  );
};

export default NftStep;
