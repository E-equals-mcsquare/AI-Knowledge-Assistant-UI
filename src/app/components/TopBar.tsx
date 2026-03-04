import { Settings, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";

export function TopBar() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="font-semibold text-gray-900">AI Knowledge Assistant</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            Knowledge Base Connected
          </span>
        </div>
      </div>

      <Button variant="ghost" size="icon" className="hover:bg-gray-100">
        <Settings className="w-5 h-5 text-gray-600" />
      </Button>
    </div>
  );
}
