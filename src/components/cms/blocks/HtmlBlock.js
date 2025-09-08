import DOMPurify from "isomorphic-dompurify";
import { escapeHTML } from "@/utils/helper";

export default function HtmlBlock({ ...props }) {
    const sanitizedHtml = DOMPurify.sanitize(props.value);

    return <div dangerouslySetInnerHTML={{ __html: escapeHTML(sanitizedHtml) }} />;
}
