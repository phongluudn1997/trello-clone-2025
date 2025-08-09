import {useContext} from "react";
import {TrelloContext} from "./TrelloContext.ts";

export const useTrello = () => {
    const value = useContext(TrelloContext)
    if (!value) {
        throw new Error("Only use useTrello inside TrelloProvider")
    }
    return value
}