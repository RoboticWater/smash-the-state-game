import { writable } from 'svelte/store';

function createCardSelect() {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        addCard: card => update(state => [...state, card]),
        reset: () => set([])
    };
}

export const cardSelect = createCardSelect();