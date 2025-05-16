"use client";


import { IconType } from "react-icons";


interface ButtonProps{
    label: string;
    disabled?: boolean;
    outlined?: boolean;
    small?: boolean;
    custom?: string;
    icon?: IconType;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button : React.FC<ButtonProps>= ({label,disabled,outlined,small,custom,icon:Icon,onClick})=>{
    return(
        <button onClick={onClick} disabled={disabled} className={`disabled:opacity-70 disabled:cursor-not-allowed rounded-md hover:opacity-80 transition w-full border-slate-700 flex items-center justify-center gap-2 ${outlined? "bg-white" :"bg-slate-700"}
         ${outlined? "text-slate-700": "text-white" } ${small?"text-sm font-light":"text-md font-semibold"}  ${small?"px-2 py-1 border-[1px]":"px-3 py-4 border-2"} ${custom ? custom : ""}`}>
            {Icon && <Icon size={24}/>}
            {label}
        </button>
    );
}
export default Button;