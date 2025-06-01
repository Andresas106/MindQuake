import { supabase } from '../db/supabase';
import Achievement from '../model/Achievement';

const normalizeCategory = (category) =>
  category.toLowerCase().replace(/ & /g, '_and_').replace(/\s+/g, '_');

const checkAndUnlockAchievements = async (userId, categoryStats) => {
  const thresholds = [
    { tier: 'bronze', minCorrect: 5 },
    { tier: 'silver', minCorrect: 10 },
    { tier: 'platinum', minCorrect: 20 },
  ];

  const unlockedAchievements = [];

  for (const [category, correct] of Object.entries(categoryStats)) {
    const normalizedCategory = normalizeCategory(category);

    for (const { tier, minCorrect } of thresholds) {
      if (correct >= minCorrect) {
        const achievementKey = `${normalizedCategory}_${tier}`;

        console.log(achievementKey);

        // Buscar logro por name
        const { data: achievementData, error: achievementError } = await supabase
          .from('achievements')
          .select('id, name, icon')
          .eq('key', achievementKey)
          .maybeSingle();

        if (achievementError || !achievementData) {
          console.error(`Error fetching achievement "${achievementKey}":`, achievementError);
          continue;
        }

        // Verificar si ya está desbloqueado
        const { data: alreadyUnlocked, error: alreadyError } = await supabase
          .from('user_achievements')
          .select('id')
          .eq('user_id', userId)
          .eq('achievement_id', achievementData.id)
          .maybeSingle();

        if (alreadyError) {
          console.error(`Error checking if unlocked:`, alreadyError);
          continue;
        }

        if (!alreadyUnlocked) {
          const unlockedAt = new Date().toISOString();

          const { error: insertError } = await supabase
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achievementData.id,
              unlocked_at: unlockedAt,
            });

          if (!insertError) {
            unlockedAchievements.push(
              new Achievement({
                id: achievementData.id,
                name: achievementData.name,
                icon: achievementData.icon,
                unlockedAt,
              })
            );
          } else {
            console.error(`Error inserting unlocked achievement:`, insertError);
          }
        }
      }
    }
  }

  return unlockedAchievements; // Lista de objetos Achievement
};

export default checkAndUnlockAchievements;
