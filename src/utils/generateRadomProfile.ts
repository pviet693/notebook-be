const profileImgsNameList = [
    "Garfield",
    "Tinkerbell",
    "Annie",
    "Loki",
    "Cleo",
    "Angel",
    "Bob",
    "Mia",
    "Coco",
    "Gracie",
    "Bear",
    "Bella",
    "Abby",
    "Harley",
    "Cali",
    "Leo",
    "Luna",
    "Jack",
    "Felix",
    "Kiki"
];

const profileImgsCollectionsList = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

export const generateRadomProfile = () =>
    `https://api.dicebear.com/6.x/${profileImgsCollectionsList[Math.floor(Math.random() * profileImgsCollectionsList.length)]}/svg?seed=${profileImgsNameList[Math.floor(Math.random() * profileImgsNameList.length)]}`;
