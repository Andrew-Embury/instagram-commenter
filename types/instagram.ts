export interface InstagramComment {
  id: string;
  text: string;
  timestamp: string;
  username: string;
  parent_id?: string;
  replies?: InstagramComment[];
}

export interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
}
