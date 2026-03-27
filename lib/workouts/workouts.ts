import { createSupabaseClient } from "@/lib/supabase/server";

export async function getWorkoutHistory() {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("workouts")
    .select(
      `                                                                          
        id,
        name,                                                                            
        completed_at,                                                                  
        workout_exercises (
          id,
          exercise_id,
          exercise_name,
          order_index,
          workout_sets (                                                                 
            id,                               
            weight,                                                                      
            reps,                                                                      
            is_completed,                                                                
            order_index
          )                                                                              
        )                                                                              
      `,
    )
    .order("completed_at", { ascending: false });

  if (error) throw error;
  return data;
}
