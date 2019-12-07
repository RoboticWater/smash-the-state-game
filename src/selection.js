import { writable } from 'svelte/store';

function createCardSelect() {
    const { subscribe, set, update } = writable([]);

    const toggleCard = (card, row, col) => update(state => {
        let i = state.findIndex(c => c.id === card.id)
        if (i < 0) {
            state = [...state, Object.assign({ row, col }, card)]
        } else {
            state = state.slice(0, i).concat(state.slice(i + 1, state.length))
        }
        return state;
    })

    return {
        subscribe,
        addCard: (col, row, card) => update(state => {
            if (!state.find(c => c.id === card.id)) {
                return [...state, Object.assign({ col, row }, card)]
            } else {
                return state;
            }
        }),
        endSelection: () => set([])
    };
}

export const selection = createCardSelect();