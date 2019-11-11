import { writable } from 'svelte/store';

function createCardSelect() {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        addCard: card => update(state => [...state, card]),
        removeCard: id => update(state => {
            let i = state.findIndex(c => c.id === id);
            if (i < 0)
                return state;
            return state.slice(0, i).concat(state.slice(i + 1, state.length));
        }),
        removeCardIndex: i => update(state => {
            return state.slice(0, i).concat(state.slice(i + 1, state.length));
        }),
        reset: () => set([])
    };
}

export const cardSelect = createCardSelect();