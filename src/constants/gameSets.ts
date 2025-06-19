const GAME_SETS = [
    "You are all stuck in a military underground bunker.",
    "You are all family members sharing a house, with very different personalities",
    "You are all at a reunion party, everyone being in their mid 40's"
]

export const getRandomGameSet = () => {
    const randomIndex = Math.floor(Math.random() * GAME_SETS.length);
    return GAME_SETS[randomIndex];
}