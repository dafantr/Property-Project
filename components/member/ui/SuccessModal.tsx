import { Check } from "lucide-react";

export default function SuccessModal({ message }: { message: string }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">
            Success!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {message}
          </p>
        </div>
      </div>
    )
}