export interface IMenuItem {
  id: number;
  caption: string;
  group: string;
  icon: string;
  info: string;
  isBookmarked: boolean;
  route: string[];
}
