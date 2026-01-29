import DOMPurify from 'dompurify';
 
interface HtmlRendererProps {
  html: string;
}
 
export default function HtmlRenderer({ html }: HtmlRendererProps) {
  return (
    <div
      className='text-sm [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6'
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(html),
      }}
    />
  );
}
