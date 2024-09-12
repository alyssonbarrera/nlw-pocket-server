import dayjs from "dayjs";
import { drizzleClient, drizzleDb } from "../index";
import { goalCompletions, goals } from "../schemas";

async function seed() {
  await drizzleDb.delete(goalCompletions);
  await drizzleDb.delete(goals);

  const goalsResult = await drizzleDb
    .insert(goals)
    .values([
      { title: "Acordar cedo", desiredWeeklyFrequency: 5 },
      { title: "Exercitar-me", desiredWeeklyFrequency: 3 },
      { title: "Meditar", desiredWeeklyFrequency: 1 },
    ])
    .returning();

  const startOfWeek = dayjs().startOf("week");

  await drizzleDb.insert(goalCompletions).values([
    { goalId: goalsResult[0].id, createdAt: startOfWeek.toDate() },
    {
      goalId: goalsResult[1].id,
      createdAt: startOfWeek.add(1, "day").toDate(),
    },
  ]);
}

seed().finally(() => {
  drizzleClient.end();
});
