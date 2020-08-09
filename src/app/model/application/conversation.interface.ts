export interface ConversationModel {
  conversations: Conversation[];
}
export interface Conversation {
  id: number;
  institution_id: number;
  visitor_id: number;
  user_id: number;
  ip: string;
  url: string;
  first_reply_at: string;
  last_reply_at: string;
  created_at: string;
  updated_at: string;
  ended_at?: any;
  visitor: Visitor;
  user: User;
}

export interface User {
  id: number;
  institution_id: number;
  name: string;
  email: string;
  email_verified_at?: any;
  created_at: string;
  updated_at: string;
  photo_url: string;
}

export interface Visitor {
  id: number;
  institution_id: number;
  unique_id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: any;
  memo: string;
  created_at: string;
  updated_at: string;
}
