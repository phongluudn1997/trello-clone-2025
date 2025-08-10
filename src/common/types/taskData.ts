export interface TaskData {
  id: string;
  name: string;
  description: string;
  imageIds: string[];
  deadline?: string | Date;
  favorite: boolean;
}
