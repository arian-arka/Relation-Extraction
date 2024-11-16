import AppSchemaCommand from "../Command/AppSchema.command";

export const providers : {[key : string] : Function} = {
    'AppSchema' : AppSchemaCommand
};