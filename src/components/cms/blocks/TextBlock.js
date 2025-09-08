import DOMPurify from "isomorphic-dompurify";

export default function TextBlock({ ...props }) {
    const sanitizedHtml = DOMPurify.sanitize(props.value);

    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
