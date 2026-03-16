export default class Input {
    static mappings = [];  // {name, input, action}

    static addMapping(name, input, action) {
        Input.mappings.push({
            name: name,
            input: input,
            action: action
        })
    }

    static removeMapping(name) {
        const i = Input.mappings.findIndex(m => m.name === name);

        if (i !== -1) {
            Input.mappings.splice(i, 1);
        }
    }

    static setupInput(scene) {
        scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            Input.#triggerInput('wheel', deltaY * .4); 
        });
    }

    static #triggerInput(input, ...args) {
        Input.mappings.forEach(m => {
            if (m.input === input) {
                m.action(...args);
            }
        });
    }
}