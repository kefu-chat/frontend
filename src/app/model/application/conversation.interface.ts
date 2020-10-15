import {User as SettingUser} from '@delon/theme/src/services/settings/interface'

export interface ConversationModel {
  institution_id?: string;
  user_id?: string;
  conversations: Conversation[];
}
export interface Conversation {
  id: any;
  institution_id?: number;
  visitor_id: number;
  user_id?: number;
  ip: string;
  url: string;
  first_reply_at: string;
  last_reply_at: string;
  created_at: string;
  updated_at: string;
  ended_at?: any;
  visitor: Visitor;
  user: User;
  hostname?: string;
  geo: Geo;
  color?: string;
  icon?: string;
  last_message?: MessageModel;
  online_status?: boolean;
  referer?: string;
}

export interface Website {
  id: string;
  name: string;
  website: string;
  terminate_manual?: null | string;
  created_at?: string;
  updated_at?: null | string;
  users?: User[];
  billing_name?: string | null;
  billing_phone?: string | null;
  technical_name?: string | null;
  technical_phone?: string | null;
  users_count?: number | null;
  visitors?: Visitor[];
  visitors_count?: number | null;
  enterprise?: Enterprise;
  public_id?: string;
  expand?: boolean;
  terminate_timeout?: string;
  greeting_message?: string;
  enterprise_id?: string | number;
}

export interface Enterprise {
  name: string;
  serial: string;
  profile: string;
  country: string;
  address: string;
  phone: string;
  geographic: {
    province: {
      key: string;
    };
    city: {
      key: string;
    };
    area: {
      key: string;
    };
    street: {
      key: string;
    };
  };
}

export interface User extends SettingUser {
  id: any;
  institution_id: any;
  name: string;
  email: string;
  email_verified_at?: any;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  avatar: string;
  title?: string;
  conversations_count?: number;
}

export interface UserWithPassword extends User {
  password: string;
  password_confirmation: string;
}

export interface Visitor {
  id: any;
  institution_id: any;
  unique_id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: any;
  memo: string;
  created_at: string;
  updated_at: string;
}

export interface MessageData {
  has_previous: boolean;
  conversation: MessageConversation;
  messages: MessageModel[];
}

export interface MessageModel {
  id: any;
  sender_id: any;
  conversation_id: any;
  type: number;
  content: string;
  created_at: string;
  updated_at: string;
  sender_type_text: string;
  sender?: Sender;
  loading?: boolean;
}

export interface Sender {
  id?: any;
  institution_id?: any;
  name?: string;
  email?: string;
  email_verified_at?: any;
  created_at?: string;
  updated_at?: string;
  title?: string;
  unique_id?: string;
  phone?: string;
  avatar?: any;
  memo?: string;
}

export interface MessageConversation {
  id: any;
  visitor_id: any;
  ip: string;
  url: string;
  first_reply_at: string;
  last_reply_at: string;
  created_at: string;
  updated_at: string;
  user: MessageUser;
  visitor: MessageVisitor;
  geo: Geo;
  referer?: string;
}

export interface MessageVisitor {
  id: any;
  institution_id: any;
  unique_id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: any;
  memo: string;
  created_at: string;
  updated_at: string;
}

export interface MessageUser {
  id: any;
  institution_id: any;
  name: string;
  email: string;
  email_verified_at?: any;
  created_at: string;
  updated_at: string;
  avatar: string;
  title?: string;
}

export interface SendMessageModel {
  type: number;
  content: string;
}

export interface Geo {
  ip: string;
  area: string;
  country: string;
  city: string;
  province: string;
  county: string;
  postal_code: string;
  lat: number;
  lon: number;
  timezone: string;
  continent: string;
  currency: string;
  default: boolean;
}

export interface CountInterface {
  assigned_count: number;
  unassigned_count: number;
  history_count: number;
  online_visitor_count: number;
  visitor_count: number;
}
