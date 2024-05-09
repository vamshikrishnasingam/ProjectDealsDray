import React from "react";

function Logo() {
  return (
    <div className="flex items-center bg-gray-700">
      <img
        className="h-12 w-auto m-2 text-left"
        src="media/logo.png"
        alt="Your Company"
      />
      <span className="text-lg mx-auto font-bold text-center">
        DealsDray.com
      </span>
    </div>
  );
}

export default Logo;
