export type Post = {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
};

export type Comment = {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  replies?: Comment[];
};
