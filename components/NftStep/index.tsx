import React, { FC } from "react";

interface INftStepProps {
  step: string;
  title: string;
  description: string;
}

const NftStep: FC<INftStepProps> = ({ step, title, description }) => {
  return (
    <div>
      <div className="w-[174px] h-[400px] border border-[#696969] rounded-[20px] flex flex-col items-center">
        <p className="text-purple text-[40px] font-bold h-[25%] flex justify-center items-center">
          {step}.
        </p>
        <div className="w-full flex justify-center">
          <div className="h-[1px] bg-[#5F5E5F] w-[88%]"></div>
        </div>
        <p className="steps-text text-2xl font-semibold w-full text-white h-[75%] flex justify-center items-center">
          {title}
        </p>
      </div>
      <div className=""></div>
    </div>
  );
};

export default NftStep;
