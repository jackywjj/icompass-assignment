export interface User {
  id: string;
  name: string;
  color: string;
  cursor?: {
    index: number
    length: number
  };
}
