export interface ITask {
  title: string;
  description: null | string;
  priority: number;
  defeated: number;
  type: number;
  minutes_expected: number;
  minutes_completed: number;
  alert_id: number;
  expiration_date: Date;
  id: number;
  owner_id: number;
  categories: Category[];
}

export interface Category {
  name: string;
  description: null;
}
