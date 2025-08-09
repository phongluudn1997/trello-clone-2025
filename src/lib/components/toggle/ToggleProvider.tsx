import {type PropsWithChildren, useState} from "react";
import {ToggleContext} from "./toggleContext.ts";

export const ToggleProvider = ({children}: PropsWithChildren) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => {
        setIsOpen(isOpen => !isOpen)
    }

    return <ToggleContext.Provider value={{isOpen, toggle}}>{children}</ToggleContext.Provider>
}



