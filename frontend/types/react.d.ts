// Type overrides for React to fix Bun's outdated @types/react
declare module 'react' {
  export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
  
  export function useEffect(effect: EffectCallback, deps?: DependencyList): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
  export function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
  export function useRef<T>(initialValue: T): MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): RefObject<T>;
  export function useRef<T = undefined>(): MutableRefObject<T | undefined>;
  export function useContext<T>(context: Context<T>): T;
  
  export function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null
  ): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

  export type FC<P = {}> = FunctionComponent<P>;
  export type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined | string | number | Iterable<ReactNode>;
  export type ReactElement<P = any> = {
    type: any;
    props: P;
    key: string | number | null;
  };
  export type ComponentType<P = {}> = FunctionComponent<P> | ComponentClass<P>;
  export {ComponentType as ComponentType};
  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type EffectCallback = () => (void | (() => void | undefined));
  export type DependencyList = ReadonlyArray<any>;
  
  export interface MutableRefObject<T> {
    current: T;
  }
  export interface RefObject<T> {
    readonly current: T | null;
  }
  export interface Context<T> {
    Provider: any;
    Consumer: any;
    displayName?: string;
  }
  
  export type Ref<T> = RefCallback<T> | RefObject<T> | null | undefined;
  export type RefCallback<T> = (instance: T | null) => void;
  export type RefAttributes<T> = { ref?: Ref<T> };
  export type PropsWithoutRef<P> = Omit<P, 'ref'>;
  
  export interface FunctionComponent<P = {}> {
    (props: P): ReactElement<any, any> | null;
    displayName?: string;
  }
  
  export interface ComponentClass<P = {}> {
    new (props: P): Component<P, any>;
  }
  
  export class Component<P = {}, S = {}> {
    constructor(props: P);
    setState(state: Partial<S> | ((prevState: Readonly<S>) => Partial<S>), callback?: () => void): void;
    forceUpdate(callback?: () => void): void;
    render(): ReactNode;
    props: Readonly<P>;
    state: Readonly<S>;
  }
  
  export type ReactChild = ReactElement | string | number;
  export type ReactFragment = Iterable<ReactNode>;
  export type ReactPortal = any;
  
  export interface ForwardRefExoticComponent<P> {
    (props: P): ReactElement | null;
    defaultProps?: Partial<P>;
    displayName?: string;
  }
  
  export interface NamedExoticComponent<P = {}> {
    (props: P): ReactElement | null;
    displayName?: string;
  }
  
  export interface SVGProps<T> extends HTMLAttributes<T> {
    xmlns?: string;
    viewBox?: string;
    width?: number | string;
    height?: number | string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
    strokeLinecap?: string;
    strokeLinejoin?: string;
  }

  export interface HTMLAttributes<T = any> {
    className?: string;
    id?: string;
    style?: CSSProperties;
    children?: ReactNode;
    onClick?: (event: MouseEvent<T>) => void;
    onChange?: (event: ChangeEvent<T>) => void;
    onSubmit?: (event: FormEvent<T>) => void;
    ref?: Ref<T>;
    key?: string | number | null;
    [key: string]: any;
  }
  
  export interface InputHTMLAttributes<T = any> extends HTMLAttributes<T> {
    type?: string;
    value?: string | number | readonly string[];
    placeholder?: string;
    disabled?: boolean;
    name?: string;
    checked?: boolean;
    readOnly?: boolean;
    required?: boolean;
    autoFocus?: boolean;
    autoComplete?: string;
    min?: number | string;
    max?: number | string;
    step?: number | string;
    pattern?: string;
    accept?: string;
    multiple?: boolean;
  }
  
  export interface ButtonHTMLAttributes<T = any> extends HTMLAttributes<T> {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
  }
  
  export interface CSSProperties {
    [key: string]: any;
  }
  
  export interface MouseEvent<T = Element> {
    preventDefault(): void;
    stopPropagation(): void;
    currentTarget: EventTarget & T;
    target: EventTarget;
    nativeEvent: Event;
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
  }
  
  export interface ChangeEvent<T = Element> {
    target: EventTarget & T;
    currentTarget: EventTarget & T;
    nativeEvent: Event;
  }
  export {ChangeEvent as ChangeEvent};
  
  export type ComponentProps<T> = T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : T extends (props: infer P) => any
    ? P
    : any;
  export {ComponentProps as ComponentProps};
  
  export type ComponentPropsWithoutRef<T> = PropsWithoutRef<ComponentProps<T>>;
  export {ComponentPropsWithoutRef as ComponentPropsWithoutRef};
  
  export type ElementRef<T> = T extends React.ForwardRefExoticComponent<infer P>
    ? P extends RefAttributes<infer E>
      ? E
      : never
    : T extends (props: any, ref: Ref<infer E>) => any
    ? E
    : any;
  export {ElementRef as ElementRef};
  
  export interface FormEvent<T = Element> {
    preventDefault(): void;
    stopPropagation(): void;
    currentTarget: EventTarget & T;
    target: EventTarget;
    nativeEvent: Event;
  }

  export interface ErrorInfo {
    componentStack: string;
  }

  export function createContext<T>(defaultValue: T): Context<T>;
  
  export const StrictMode: FC<{ children?: ReactNode }>;
  
  namespace React {
    export { useState };
    export { useEffect };
    export { useCallback };
    export { useMemo };
    export { useRef };
    export { useContext };
    export { forwardRef };
    export { Component };
    export { FC };
    export { createContext };
    export { StrictMode };
    export { ComponentProps };
    export { ReactNode };
  }

  export default React;
}

