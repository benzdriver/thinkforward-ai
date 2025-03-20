import 'react';

declare global {
  namespace JSX {
    type Element = React.ReactElement;
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
} 