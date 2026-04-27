import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: {
      id: string;
      pref_emotion: string[];
      mbti?: string;
      gender?: string;
    }) => {
      const { data, error } = await supabase
        .from("users")
        .upsert(profileData) // ID가 있으면 Update, 없으면 Insert
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // 유저 정보가 업데이트되면 'user' 관련 쿼리를 무효화해서 최신 상태를 유지합니다.
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
