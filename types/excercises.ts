export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  secondary_muscles: string[] | null;
  equipment: string | null;
  movement_pattern: string | null;
  is_compound: boolean;
  is_custom: boolean;
  created_by: string | null;
}
