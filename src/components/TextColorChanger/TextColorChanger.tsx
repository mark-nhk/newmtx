import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { store } from "../../stores";

const textColors = [
  {
    name: "gainsboro",
    value: "gainsboro",
  },
  {
    name: "lightgray",
    value: "lightgray",
  },
  {
    name: "darkgray",
    value: "darkgray",
  },
  {
    name: "gray",
    value: "gray",
  },
  {
    name: "black",
    value: "black",
  },
];

const TextColorChanger = () => {
  let { textColor, setTextColor } = store();
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setButtonRect(rect);
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedColor = textColors.find((c) => c.value === textColor) || textColors[0];

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const dropdownContent = isOpen && buttonRect && (
    <div
      ref={dropdownRef}
      className="fixed bg-second-color border border-third-color rounded shadow-lg z-[9999] min-w-[100px]"
      style={{
        top: `${buttonRect.bottom + 4}px`,
        left: `${buttonRect.left}px`,
      }}
    >
      {textColors.map((color) => (
        <button
          key={color.value}
          type="button"
          className="w-full px-3 py-2 hover:bg-third-color flex items-center justify-center transition-colors cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTextColor(color.value);
            setIsOpen(false);
          }}
        >
          <div
            className="w-6 h-6 rounded border border-third-color"
            style={{ backgroundColor: color.value }}
          />
        </button>
      ))}
    </div>
  );

  return (
    <>
      <div className="flex items-center ml-2 relative">
        <button
          ref={buttonRef}
          type="button"
          className="bg-second-color text-text-color outline-none rounded h-[35px] min-w-[100px] w-full max-w-[200px] px-2 flex items-center justify-center border border-third-color hover:opacity-80 transition-opacity cursor-pointer"
          onClick={handleButtonClick}
        >
          <div
            className="w-6 h-6 rounded border border-third-color pointer-events-none"
            style={{ backgroundColor: selectedColor.value }}
          />
        </button>
      </div>
      {isOpen && createPortal(dropdownContent, document.body)}
    </>
  );
};

export default TextColorChanger;

