import { ChevronDown, ChevronUp } from "lucide-react"; 
import { useState } from "react";


export default function Paragraph({ text, maxLength = 400 }: { text: string; maxLength?: number }) {
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate = text.length > maxLength;
  const displayedText = expanded || !shouldTruncate ? text : text.slice(0, maxLength) + "…";

  return (
    <div className="mt-5 md:mt-8 mb-5 text-justify">
      <p className="intro-bio leading-6 md:leading-7 md:text-xl">
        {displayedText}
      </p>
      {shouldTruncate && (
        <><button
          onClick={() => setExpanded(!expanded)}
          className="font-semibold hover:underline mt-2"
        >
            <div className="flex items-center gap-1">
                {expanded ? <><ChevronUp className="w-4 h-4" /> Lire moins</> : <><ChevronDown className="w-4 h-4" /> Lire Plus</>}
            </div>
        </button>
      </>)}
    </div>
  );
}
