import {meLoaderPromise, meTimeout} from "../lib/utils";

// TODO: ideally we'd like to fast forward the time for those tests in order to make them reliable and run faster
// "jest fake timer" could be used but Date.now() should also be faked in ordering to get everything working
// see https://github.com/facebook/jest/issues/2684
test("Loader promise can be quickly resolved", () => {
    const threeshold = 800;
    const onLoad = jest.fn();

    expect.assertions(3);
    const startTime = Date.now();
    return meLoaderPromise(meTimeout(400).then(() => "abcd"), threeshold, onLoad).then((value) => {
        expect(Date.now() - startTime).toBeLessThan(threeshold);
        expect(value).toBe("abcd");
        expect(onLoad.mock.calls.length).toBe(0);
    });
});

test("Loader promise can be slowly resolved", () => {
    const threeshold = 800;
    const onLoad = jest.fn();

    expect.assertions(3);
    const startTime = Date.now();
    return meLoaderPromise(meTimeout(900).then(() => 1234), threeshold, onLoad).then((value) => {
        expect(Date.now() - startTime).toBeGreaterThanOrEqual(2 * threeshold);
        expect(value).toBe(1234);
        expect(onLoad.mock.calls.length).toBe(1);
    });
});

test("Loader promise can be quickly rejected", () => {
    const threeshold = 800;
    const onLoad = jest.fn();

    expect.assertions(3);
    const startTime = Date.now();
    return meLoaderPromise(meTimeout(400).then(() => {throw "xyz"}), threeshold, onLoad).catch((error) => {
        expect(Date.now() - startTime).toBeLessThan(threeshold);
        expect(error).toBe("xyz");
        expect(onLoad.mock.calls.length).toBe(0);
    });
});

test("Loader promise can be slowly rejected", () => {
    const threeshold = 800;
    const onLoad = jest.fn();

    expect.assertions(3);
    const startTime = Date.now();
    return meLoaderPromise(meTimeout(900).then(() => {throw "ABC"}), threeshold, onLoad).catch((error) => {
        expect(Date.now() - startTime).toBeGreaterThanOrEqual(2 * threeshold);
        expect(error).toBe("ABC");
        expect(onLoad.mock.calls.length).toBe(1);
    })
});