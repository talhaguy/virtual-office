export function mockClearForModuleMock(module: any) {
    for (const i in module) {
        if (module[i].mockClear) {
            module[i].mockClear()
        }
    }
}
