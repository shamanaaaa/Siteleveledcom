import { useEffect } from "react";

/**
 * A pre-rendered form can be filled in before the JavaScript arrives, and browsers restore fields on
 * reload. That text stays in the field but React doesn't know about it, so the form would look filled
 * in and still fail validation. The form's fields need a name.
 */
export function useTypedBeforeLoad(formId: string, onValue: (name: string, value: string) => void) {
  useEffect(() => {
    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(`#${formId} input[name], #${formId} textarea[name]`).forEach((field) => {
      if (field.value) onValue(field.name, field.value);
    });
  }, []);
}
