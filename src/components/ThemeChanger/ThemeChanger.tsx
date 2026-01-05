import React, { useEffect } from "react";
import { store } from "../../stores";

const themes = [
  {
    name: "Default",
    color: {
      "--prime-color": "#202b38",
      "--text-color": "#ffffff",
      "--second-color": "#161f27",
      "--third-color": "#415771",
    },
  },
  {
    name: "Aqua",
    color: {
      "--prime-color": "#00B4D8",
      "--text-color": "#03045E",
      "--second-color": "#90E0EF",
      "--third-color": "#0077B6",
    },
  },
  {
    name: "Lightly",
    color: {
      "--prime-color": "darkgray",
      "--text-color": "black",
      "--second-color": "white",
      "--third-color": "darkslategray",
    },
  },
  {
    name: "Nordic",
    color: {
      "--prime-color": "#52796F",
      "--text-color": "#2F3E46",
      "--second-color": "#84A98C",
      "--third-color": "#354F52",
    },
  },
];

const ThemeChanger = () => {
  let { themeColor, setThemeColor } = store();

  useEffect(() => {
    const theme = themes.find((c) => c.name === themeColor);
    if (theme) {
      const setVariables = (vars: Record<string, string>) =>
        Object.entries(vars).forEach(([key, value]) => document.documentElement.style.setProperty(key, value));
      setVariables(theme.color);
    }
  }, [themeColor]);
  return (
    <div className="flex items-center">
      <select
        className="bg-second-color text-text-color outline-none rounded h-[35px] min-w-[100px] w-full max-w-[200px] px-2"
        onChange={(e) => setThemeColor(e.currentTarget.value)}
        value={themeColor}
      >
        {themes.map((t) => (
          <option key={t.name} value={t.name}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeChanger;
