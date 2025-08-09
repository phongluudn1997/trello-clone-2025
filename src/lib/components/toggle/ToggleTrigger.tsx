import type { PropsWithChildren } from "react";
import { Button, type ButtonProps } from "@mui/material";
import { useToggle } from "../../../common/hooks/useToggle.ts";
//
// export const ToggleTrigger = ({children, ...props}: PropsWithChildren<ButtonProps>) => {
//     const {toggle} = useToggle()
//     return <Button {...props} onClick={toggle}>{children}</Button>
// }
