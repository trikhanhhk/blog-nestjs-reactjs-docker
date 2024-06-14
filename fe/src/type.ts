export default interface actionType {
  payload?: any;
  type: string;
}

export type functionChange = (value: any) => void;
export type functionVoid = () => void;