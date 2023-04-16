import React, { FC, ReactNode } from "react";

interface ICustomButtonProps {
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  type?: "rounded" | "square" | "transparent";
}

const Button: FC<ICustomButtonProps> = ({
  loading,
  className,
  onClick,
  disabled,
  type,
  children,
}: ICustomButtonProps) => {
  return (
    <button
      className={` ${
        type === "rounded"
          ? "rouded-button text-white text-lg font-medium"
          : type === "transparent"
          ? `px-6 py-3 rounded-xl bg-[#141B22]`
          : ` text-[19px] font-medium text-white rounded-xl px-6 py-2 collect-button`
      } ${className}`}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading ? "loading" : children}
    </button>
  );
};

export default Button;
