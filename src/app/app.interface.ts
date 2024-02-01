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
  history_id: number;
  categories: ICategory[];
}


export interface ICategory {
  id: number;
  name: string;
  description: null;
}


export interface IHistory {
  title: string;
  description: null;
  id: number;
  tasks: ITask[];
  owner_id: number | null;
}
