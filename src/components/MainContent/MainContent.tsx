import { useEffect } from "react";
import { store } from "../../stores";

const MainContent = () => {
  let { data, setData, isWrap, setPositionCursor, fontSize, setFontSize, textColor } = store();
  useEffect(() => {
    const value = window.innerWidth;
    if (value > 800) {
      setFontSize(1.7);
    } else if (value > 500) {
      setFontSize(1.5);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(e.target.value);
    let selStart = e.target.selectionStart;
    let selEnd = e.target.selectionEnd;
    setPositionCursor({ selStart, selEnd });
  };
  const insertMyText = (e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    let selStart = target.selectionStart;
    let selEnd = target.selectionEnd;
    setPositionCursor({ selStart, selEnd });
  };
  return (
    <>
      <div className="w-full h-full p-[calc(var(--spacing)*2)] flex">
        <textarea
          id="textareaID"
          className={`flex-1 w-full h-full grow-[2]  bg-second-color rounded-[calc(var(--spacing)*2)] border border-third-color outline-0 resize-none p-[0.5rem] text-[1.3rem] min-[500px]:text-[1.5rem] min-[800px]:text-[1.7rem]`}
          style={{ 
            fontSize: `${fontSize}rem`,
            color: textColor || "gainsboro"
          }}
          value={data}
          onChange={handleChangeInput}
          onKeyUp={insertMyText}
          wrap={isWrap ? "soft" : "off"}
          onMouseUp={insertMyText}
        ></textarea>
      </div>
    </>
  );
};

export default MainContent;
