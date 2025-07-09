
type action = 'increment' | 'decrement' ;
export function reducerController(counter: number, action: action): number{
    switch (action) {
        case 'increment':
            return counter + 1;
        case 'decrement':
            return counter - 1;
        default:
            throw new Error(`Unknown action: ${action}`);
    }
}