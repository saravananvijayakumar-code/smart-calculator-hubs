declare namespace JSX {
  interface Element extends React.ReactElement<any, any> { }
  
  type HTMLAttrsWithKey<T> = React.HTMLAttributes<T> & { key?: string | number | null };
  type InputAttrsWithKey<T> = React.InputHTMLAttributes<T> & { key?: string | number | null };
  type ButtonAttrsWithKey<T> = React.ButtonHTMLAttributes<T> & { key?: string | number | null };
  type SVGPropsWithKey<T> = React.SVGProps<T> & { key?: string | number | null };
  
  interface IntrinsicElements {
    div: HTMLAttrsWithKey<HTMLDivElement>;
    span: HTMLAttrsWithKey<HTMLSpanElement>;
    p: HTMLAttrsWithKey<HTMLParagraphElement>;
    h1: HTMLAttrsWithKey<HTMLHeadingElement>;
    h2: HTMLAttrsWithKey<HTMLHeadingElement>;
    h3: HTMLAttrsWithKey<HTMLHeadingElement>;
    h4: HTMLAttrsWithKey<HTMLHeadingElement>;
    h5: HTMLAttrsWithKey<HTMLHeadingElement>;
    h6: HTMLAttrsWithKey<HTMLHeadingElement>;
    a: HTMLAttrsWithKey<HTMLAnchorElement>;
    button: ButtonAttrsWithKey<HTMLButtonElement>;
    input: InputAttrsWithKey<HTMLInputElement>;
    textarea: HTMLAttrsWithKey<HTMLTextAreaElement>;
    select: HTMLAttrsWithKey<HTMLSelectElement>;
    option: HTMLAttrsWithKey<HTMLOptionElement>;
    label: HTMLAttrsWithKey<HTMLLabelElement>;
    form: HTMLAttrsWithKey<HTMLFormElement>;
    img: HTMLAttrsWithKey<HTMLImageElement>;
    ul: HTMLAttrsWithKey<HTMLUListElement>;
    ol: HTMLAttrsWithKey<HTMLOListElement>;
    li: HTMLAttrsWithKey<HTMLLIElement>;
    svg: SVGPropsWithKey<SVGSVGElement>;
    path: SVGPropsWithKey<SVGPathElement>;
    circle: SVGPropsWithKey<SVGCircleElement>;
    rect: SVGPropsWithKey<SVGRectElement>;
    line: SVGPropsWithKey<SVGLineElement>;
    [elemName: string]: any;
  }
  
  interface ElementClass extends React.Component<any, any> {
    render(): React.ReactNode;
  }
  
  interface ElementAttributesProperty {
    props: {};
  }
  
  interface ElementChildrenAttribute {
    children: {};
  }
}
