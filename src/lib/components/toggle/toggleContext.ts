import {createContext} from "react";

interface ToggleContextValue {
    isOpen: boolean;
    toggle: () => void;
}

export const ToggleContext = createContext<ToggleContextValue | undefined>(undefined)