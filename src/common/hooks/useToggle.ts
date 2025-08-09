import {type Dispatch, type SetStateAction, useCallback, useState} from "react";

type useToggleReturnType = [boolean, () => void, Dispatch<SetStateAction<boolean>>]

export const useToggle = (defaultValue: boolean = false): useToggleReturnType => {
    const [value, setValue] = useState(defaultValue)

    const toggle = useCallback(() => {
        setValue(toggle => !toggle)
    }, [])

    return [value, toggle, setValue]
}

