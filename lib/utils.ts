/*
 * Copyright (c) 2020 XdevL. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
export const meTimeout = async (value: number): Promise<void> => new Promise((resolve) => {
    setTimeout(resolve, value);
});

export const meLoaderPromise = async <T, >(promise: Promise<T>, threeshold: number, onLoad: () => void): Promise<T> => {
    const startTime = Date.now();
    await Promise.race([meTimeout(threeshold), promise]);
    if (Date.now() - startTime < threeshold) {
        // If the promise has resolved before threeshold we just return the value straight away
        return promise;
    }
    else {
        // If the promise hasn't resolved before threeshold we make sure it doesn't get resolved for another threeshold
        onLoad();
        return Promise.all([meTimeout(threeshold), promise]).then((values) => values[1])
            .catch((error) => {
                const delay = 2 * threeshold - (Date.now() - startTime);
                return delay > 0 ? meTimeout(delay).then(() => { throw error; }) : Promise.reject(error);
            });
    }
}