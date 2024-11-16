export function isClass(obj: any): boolean {
    if (typeof obj !== 'function')
        return false;
    const descriptor = Object.getOwnPropertyDescriptor(obj, 'prototype');
    if (!descriptor)
        return false;
    return !descriptor.writable;
}