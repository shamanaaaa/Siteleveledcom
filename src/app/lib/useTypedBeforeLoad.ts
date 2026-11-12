import { useEffect, useState } from "react";

/**
 * A pre-rendered form can be filled in before the JavaScript arrives, and browsers restore fields on
 * reload. That text stays in the field but React doesn't know about it, so the form would look filled
 * in and still fail validation. The form's fields need a name.
 *
 * Returns whether React has taken over the form. Until then the submit button must stay disabled:
 * the pre-rendered <form> has no method, so the browser would send the fields as a GET, putting the
 * visitor's name, email and phone in the URL, the nginx log and the browser history. A disabled
 * default button also blocks submitting with Enter.
 */
export function useTypedBeforeLoad(formId: string, onValue: (name: string, value: string) => void) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(`#${formId} input[name], #${formId} textarea[name]`).forEach((field) => {
      if (field.value) onValue(field.name, field.value);
    });
    setReady(true);
  }, []);
  return ready;
}
