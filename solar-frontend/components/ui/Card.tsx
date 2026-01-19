import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-lg bg-white shadow ${
        hover ? "hover:shadow-lg transition" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
