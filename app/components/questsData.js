const quests = [
  { id: 1, description: "Make 1 transaction (Buy, Sell Fractions, Bridge)", points: 5000 },
  { id: 2, description: "Make 1 transaction (Buy, Sell Fractions, Bridge)", points: 5000 },
  { id: 3, description: "Make 1 transaction (Buy, Sell Fractions, Bridge)", points: 5000 },
  { id: 4, description: "Make 1 transaction (Buy, Sell Fractions, Bridge)", points: 5000 },
  { id: 5, description: "Make 1 transaction (Buy, Sell Fractions, Bridge)", points: 5000 },
  { id: 6, description: "Make 1 transaction (Buy, Sell Fractions, Bridge)", points: 5000 },
  { id: 7, description: "Make 1 transaction (Buy, Sell Fractions, Bridge)", points: 5000 },
  { id: 8, description: "Make 1 transaction (Buy, Sell Fractions, Bridge)", points: 5000 },
  { id: 9, description: "Make 1 transaction (Buy, Sell Fractions, Bridge)", points: 5000 },
  { id: 10, description: "Make 1 transaction (Buy, Sell Fractions, Bridge)", points: 5000 },
];

export const getQuests = () => {
  return quests;
};

export const updateQuest = (questId) => {
  // Simulate updating quest
  const quest = quests.find((q) => q.id === questId);
  if (quest) {
    quest.points += 1000; // Simulate earning points
  }
};
