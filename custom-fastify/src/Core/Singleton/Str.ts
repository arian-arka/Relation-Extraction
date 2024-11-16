import {Types} from "mongoose";

class Str {
    readonly RE_UNESCAPED_HTML = /[&<>"']/g
    readonly HTML_ESCAPES = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }
    readonly RE_HAS_UNESCAPED_HTML = RegExp(this.RE_UNESCAPED_HTML)

    safeString(string: string | null | undefined = ''): string {
        if (!string || string === '')
            return '';
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    escapeHtml(string: string | null | undefined = ''): string {
        if (!string || string === '')
            return '';
        return (string && this.RE_HAS_UNESCAPED_HTML.test(string))
            // @ts-ignore
            ? string.replace(this.RE_UNESCAPED_HTML, (chr) => this.HTML_ESCAPES[chr])
            : (string || '')
    }

    isValidObjectId(id : any){
        if(!!id && Types.ObjectId.isValid(id))
            return (String)(new Types.ObjectId(id)) === id.toString();
        return false;
    }

    lowerFirstChar(str : string){
        if(str.length < 2)
            return str;
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
    upFirstChar(str : string){
        if(str.length < 2)
            return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

export default new Str();