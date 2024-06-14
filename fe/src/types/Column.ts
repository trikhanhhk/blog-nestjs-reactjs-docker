import { CSSProperties } from "react";

export interface Column {
  name: string | JSX.Element;
  element: (row: any) => JSX.Element;
  style?: CSSProperties | undefined;
}