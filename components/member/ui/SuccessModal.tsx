import { Check } from "lucide-react";
import { reward } from "@/utils/types";

export default function SuccessModal() {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">
            Redemption Successful!
          </h3>
        </div>
      </div>
    )
}