// Global event type declarations to fix implicit 'any' errors
declare global {
  type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
  type TextAreaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
  type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
  type FormSubmitEvent = React.FormEvent<HTMLFormElement>;
  type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;
  type DivClickEvent = React.MouseEvent<HTMLDivElement>;
}

export {};
