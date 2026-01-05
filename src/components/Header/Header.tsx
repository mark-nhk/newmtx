"use client";

import { ButtonItems } from "../../utils/buttonItems";
import ButtonItem from "../ButtonItem/ButtonItem";
import ThemeChanger from "../ThemeChanger/ThemeChanger";
import TextColorChanger from "../TextColorChanger/TextColorChanger";

const Header = () => {
  return (
    <header className="flex items-center justify-start w-full pt-[calc(var(--spacing))] mx-auto px-[calc(var(--spacing)*2)] flex-wrap overflow-hidden">
      {ButtonItems.map((item) => (
        <ButtonItem key={item.title} icon={item.icon} onClickButton={item.onClickButton} title={item.title} />
      ))}
      <ThemeChanger />
      <TextColorChanger />
    </header>
  );
};

export default Header;
