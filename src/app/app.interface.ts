export interface ITask {
  title: string;
  description: null | string;
  priority: number;
  defeated: number;
  repeat: number;
  repeated_date: string;
  repeated_days: number;
  type: number;
  minutes_expected: number;
  minutes_completed: number;
  minutes_total: number;
  alert_id: number;
  expiration_date: Date;
  id: number;
  history_id: number;
  categories: ICategory[];
}


export interface ITaskCreate {
  title: string;
  description?: null | string;
  priority: number;
  type: number;
  minutes_expected: number;
  minutes_completed?: number;
  alert_id: number;
  expiration_date: string;
  categories: number[];
}


export interface ICategory {
  id: number;
  name: string;
  description: null;
}


export interface IHistory {
  title: string;
  description: null;
  added_minutes: number;
  id: number;
  tasks: ITask[];
  owner_id: number | null;
}
