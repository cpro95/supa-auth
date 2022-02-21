import { useState } from 'react'

export function useFormFields<T>(
    initialValues: T
): [T, (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, () => void] {
    const [values, setValues] = useState<T>(initialValues);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.persist();
        const { target } = event;
        const { name, value } = target;
        setValues({ ...values, [name]: value });
    }
    const resetFormFields = () => setValues(initialValues);
    return [values, handleChange, resetFormFields];
}
