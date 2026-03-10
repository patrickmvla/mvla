export interface AdminUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  role?: string;
  banned?: boolean;
  banReason?: string;
  createdAt: string | Date;
}

export interface AdminIdea {
  id: number;
  slug: string;
  title: string;
  published: boolean;
  viewCount: number;
}

export interface AdminRabbitHole {
  id: number;
  title: string;
  published: boolean;
  viewCount: number;
}
