import {poll} from '../../src/prPoller'

export function handler(event, context, callback) {
    console.log(event);
    poll();
    callback()
}