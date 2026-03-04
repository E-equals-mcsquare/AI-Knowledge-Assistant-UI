import { FileText } from "lucide-react";

interface SourceTagProps {
  title: string;
  page?: number;
}

export function SourceTag({ title, page }: SourceTagProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs">
      <FileText className="w-3 h-3 text-blue-600" />
      <span className="text-blue-900 font-medium">{title}</span>
      {page && <span className="text-blue-600">• p.{page}</span>}
    </div>
  );
}
