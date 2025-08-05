export const suits = '♠♥♣♦'.split('');

export const cardNames = {
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: 'J',
    12: 'Q',
    13: 'K',
    14: 'A'
} as const;

export type Card = {
    value: keyof typeof cardNames;
    suit: '♠' | '♣' | '♥' | '♦';
};


export class Game {
    public deck: Card[]
    public tableStacks: Card[][]
    public isWon: boolean
    public isLost: boolean

    constructor(deck: Card[], tableStacks: Card[][]) {
        this.deck = deck
        this.tableStacks = tableStacks
        this.isWon = false
        this.isLost = false
    }

    deal() {
        for (let i = 0; i < 4; i++) {
            const card = this.deck.pop();
            if (!card) {

                throw new Error('deal deck is empty')
            }
            this.tableStacks[i].push(card);
        }
    }

    step(): Game[] {
        let didRemove = false;

        if (this.isWon || this.isLost) {
            return [this];
        }

        const topCards = this.tableStacks.map((stack) => stack[stack.length - 1]).filter(Boolean);

        // If deck is empty
        if (this.deck.length === 0) {
            const tableCardsCount = this.tableStacks.flat().length
            const isWon = topCards.length == 4 && topCards.every((card) => card.value === 14) && tableCardsCount === 4;
            if (isWon) {
                this.isWon = true;
                console.log("game won!")
                return [this];
            } else {
                // this.isLost = true;
            }
        }


        // If all stacks are empty, deal
        if (topCards.length === 0) {
            if (this.deck.length > 0) {
                // console.log("All decks are empty, dealing");
                this.deal();
            } else {
                console.error("could not deal")
                this.isLost = true;
            }
            return [this];
        }


        // If any stack is empty, fork game state
        for (let stackId = 0; stackId < 4; stackId++) {
            const stack = this.tableStacks[stackId];
            if (stack.length === 0) {
                const newGames: Game[] = [];

                for (let moveStackId = 0; moveStackId < 4; moveStackId++) {
                    if (stackId === moveStackId) {
                        continue;
                    }
                    const moveStack = [...this.tableStacks[moveStackId]];
                    if (moveStack.length < 2) {
                        continue;
                    }

                    // console.log("Forking game state", { stackId, moveStackId });

                    // Clone table stacks
                    const newTableStacks: Card[][] = [
                        [...this.tableStacks[0]],
                        [...this.tableStacks[1]],
                        [...this.tableStacks[2]],
                        [...this.tableStacks[3]],
                    ]

                    // Move card
                    const card = moveStack.pop();
                    if (!card) {
                        throw new Error('Not implemented')
                    }
                    newTableStacks[stackId].push(card);
                    newTableStacks[moveStackId] = moveStack;

                    // Fork game state
                    const forkedGame = new Game([...this.deck], [...newTableStacks]);
                    newGames.push(forkedGame);
                }

                if (newGames.length > 0) {
                    return newGames
                }
            }
        }

        for (let stackId = 0; stackId < 4; stackId++) {
            const stack = this.tableStacks[stackId];
            if (stack.length === 0) {
                continue;
            }

            const card = stack[stack.length - 1];

            const sameSuits = topCards.filter((topCard) => topCard.suit === card.suit);

            const values = sameSuits.map((topCard) => topCard.value);

            const max = Math.max(...values);

            if (card.value < max) {
                // Remove card from stack
                stack.pop();
                this.tableStacks[stackId] = [...stack];

                // console.log('Removed card from stack', stackId);
                // console.log({ tableStacks: this.tableStacks });

                didRemove = true;
                break;
            }
        }

        if (!didRemove) {
            if (this.deck.length === 0) {
                this.isLost = true;
                return [this];
            }
        }

        if (!didRemove) {
            // console.log("No cards removed, dealing");
            this.deal();
        }

        return [this];
    }
}

export class MultiGames {
    public games: Game[]

    constructor() {
        const cards = Array.from({ length: 52 }, (_, i) => {
            const value = (i % 13) + 2;
            const suit = suits[Math.floor(i / 13)];
            return { value, suit: suit as '♠' | '♣' | '♥' | '♦' } as Card;
        });

        // shuffled cards
        const deck: Card[] = cards.slice().sort(() => Math.random() - 0.5);

        const tableStacks: Card[][] = Array.from({ length: 4 }, () => []);

        this.games = [new Game([...deck], tableStacks)]
    }

    step() {
        const newGames = this.games.flatMap((game) => game.step())
        this.games = newGames
    }

}

