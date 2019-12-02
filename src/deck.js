import { Type, Suit } from './cardTypes.js';

let id = 0;
const Card = (rank, suit, type) => ({ id: id++, rank, suit, type, life: 100 * rank, curLife: 100 * rank })

export const Deck = () => ([
    ...[...Array(4)].map(i => Card(1, Suit.CLUBS, Type.SERF)),
    ...[...Array(2)].map(i => Card(2, Suit.CLUBS, Type.SERF)),
    ...[...Array(2)].map(i => Card(1, Suit.CLUBS, Type.FACE)),
    ...[...Array(2)].map(i => Card(2, Suit.CLUBS, Type.FACE)),
    ...[...Array(2)].map(i => Card(3, Suit.CLUBS, Type.FACE)),
    ...[...Array(2)].map(i => Card(4, Suit.CLUBS, Type.FACE)),
    ...[...Array(4)].map(i => Card(1, Suit.HEARTS, Type.SERF)),
    ...[...Array(2)].map(i => Card(2, Suit.HEARTS, Type.SERF)),
    ...[...Array(2)].map(i => Card(1, Suit.HEARTS, Type.FACE)),
    ...[...Array(2)].map(i => Card(2, Suit.HEARTS, Type.FACE)),
    ...[...Array(2)].map(i => Card(3, Suit.HEARTS, Type.FACE)),
    ...[...Array(2)].map(i => Card(4, Suit.HEARTS, Type.FACE)),
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