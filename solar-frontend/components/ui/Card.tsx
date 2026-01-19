import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Card = ({
  children,
  className = "",
  hover,
  onClick,
}: CardProps) => {
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
