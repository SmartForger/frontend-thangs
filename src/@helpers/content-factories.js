export function createBatch(number, factory) {
    const batch = [];
    for (let i = 1; i <= number; i++) {
        batch.push(factory(i));
    }
    return batch;
}

export const userFactory = (index = 1) => ({
    id: index,
    fullName: `Test User ${index}`,
    profile: {},
});

export const attachmentFactory = (index = 1) => ({
    material: 'Aluminum',
    height: 55.5,
    length: 25.5,
    width: 30,
    weight: 300,
    ansi: true,
});

export const modelFactory = (index = 1) => ({
    id: index,
    name: `Related model ${index}`,
    owner: userFactory(),
    likesCount: 2014,
    commentsCount: 365,
    attachment: attachmentFactory(),
});
