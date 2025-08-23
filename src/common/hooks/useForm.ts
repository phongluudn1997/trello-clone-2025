import { type ChangeEvent, useCallback, useState } from "react";

export const useForm = <TFormData>(initialValue: TFormData) => {
  const [formState, setFormState] = useState(initialValue);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setFormState((formState) => ({
        ...formState,
        [e.target.name]: e.target.value,
      })),
    [],
  );

  const reset = useCallback(() => {
    setFormState(initialValue);
  }, [initialValue]);

  return { formState, setFormState, handleChange, reset };
};
