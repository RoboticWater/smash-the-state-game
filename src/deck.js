import { Type, Suit } from './cardTypes.js';

let id = 0;
const Card = (rank, suit, type) => ({ id: id++, rank, suit, type, life: 100 * rank, lifeTotal: 100 * rank })

// export const Deck = () => ([
//     ...[...Array(4)].map(i => Card(1, Suit.SPADES, Type.SERF)),
//     ...[...Array(2)].map(i => Card(2, Suit.SPADES, Type.SERF)),
//     ...[...Array(2)].map(i => Card(1, Suit.SPADES, Type.FACE)),
//     ...[...Array(2)].map(i => Card(2, Suit.SPADES, Type.FACE)),
//     ...[...Array(2)].map(i => Card(3, Suit.SPADES, Type.FACE)),
//     ...[...Array(2)].map(i => Card(4, Suit.SPADES, Type.FACE)),
//     ...[...Array(4)].map(i => Card(1, Suit.DIAMONDS, Type.SERF)),
//     ...[...Array(2)].map(i => Card(2, Suit.DIAMONDS, Type.SERF)),
//     ...[...Array(2)].map(i => Card(1, Suit.DIAMONDS, Type.FACE)),
//     ...[...Array(2)].map(i => Card(2, Suit.DIAMONDS, Type.FACE)),
//     ...[...Array(2)].map(i => Card(3, Suit.DIAMONDS, Type.FACE)),
//     ...[...Array(2)].map(i => Card(4, Suit.DIAMONDS, Type.FACE)),
// ]);

export const Deck = () => ([
    ...[...Array(1)].map(i => Card(4, Suit.SPADES, Type.FACE)),
    ...[...Array(1)].map(i => Card(1, Suit.SPADES, Type.SERF)),
]);

export const generateDeck = n => shuffle([...Array(n)].reduce((acc, cur) => acc.concat(Deck()), []))

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}