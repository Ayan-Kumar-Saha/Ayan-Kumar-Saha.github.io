export default class CustomContextPadProvider {
    constructor(contextPad) {
        contextPad.registerProvider(this);
    }

    getContextPadEntries() {
        return function (entries) {
            delete entries["append.gateway"];
            delete entries["append.text-annotation"];
            delete entries["replace"];
            delete entries["append.intermediate-event"];
            return entries;
        };
    }
}

CustomContextPadProvider.$inject = ["contextPad"];