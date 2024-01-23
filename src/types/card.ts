export interface ICard {
  _id?: string;
  name: string;
  link: string,
  owner: string,
  likes: string[],
  createAt: Date,
  __v: number;
}
