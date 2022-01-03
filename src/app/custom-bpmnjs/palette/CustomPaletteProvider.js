export default class CustomPaletteProvider {
  constructor(palette) {
    palette.registerProvider(this);
  }

  getPaletteEntries() {
    return function (entries) {
      delete entries["lasso-tool"];
      delete entries["space-tool"];
      delete entries["create.exclusive-gateway"];
      delete entries["create.intermediate-event"];
      // delete entries["create.task"];
      delete entries["create.data-store"];
      delete entries["create.group"];
      delete entries["create.participant-expanded"];
      delete entries["create.data-object"];
      // delete entries["create.subprocess-expanded"];
      return entries;
    };
  }
}

CustomPaletteProvider.$inject = ["palette"];