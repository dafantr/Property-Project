import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import { ConfirmWithdrawModalProps } from "@/utils/types";
import { formatCurrency } from "@/utils/format";
import { useTheme } from "next-themes";
import { createWithdrawalRequest } from "@/utils/actions";

export default function ConfirmWithdrawModal(
    {
        member,
        setShowWithdrawModal,
        setShowSuccessModal
    }: ConfirmWithdrawModalProps
) {
    const { theme } = useTheme();

    const onBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
		  setShowWithdrawModal(false);
		}
	};

    const darkModeStyles = {
		input: "dark:bg-zinc-800 dark:border-zinc-700 dark:text-white",
		inputReadOnly: "bg-gray-50 dark:bg-zinc-900 cursor-not-allowed opacity-75",
		label: "dark:text-gray-300",
		select: {
			control: (base: any) => ({   
				...base,
				backgroundColor: theme === "dark" ? "#18181b" : base.backgroundColor, // zinc-900
				borderColor: theme === "dark" ? "#3f3f46" : base.borderColor, // zinc-700
				color: theme === "dark" ? "#fff" : base.color,
				"&:hover": {
					borderColor: theme === "dark" ? "#C4A777" : base.borderColor
				}
			}),
			menu: (base: any) => ({
				...base,
				backgroundColor: theme === "dark" ? "#18181b" : base.backgroundColor, // zinc-900
			}),
			option: (base: any, state: any) => ({
				...base,
				backgroundColor:
					theme === "dark"
						? state.isFocused
							? "#27272a" // zinc-800
							: "#18181b" // zinc-900
						: state.isFocused
						? "#f4f4f5" // zinc-100
						: base.backgroundColor,
				color: theme === "dark" ? "#fff" : "#000",
				"&:hover": {
					backgroundColor: theme === "dark" ? "#C4A777" : "#f4f4f5",
					color: theme === "dark" ? "#fff" : "#000"
				}
			}),
			singleValue: (base: any) => ({
				...base,
				color: theme === "dark" ? "#fff" : "#000",
			}),
			input: (base: any) => ({
				...base,
				color: theme === "dark" ? "#fff" : "#000",
			}),
		},
	};
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onBackdropClick}>
        <section className="max-w-3xl mx-auto p-4">
			<div className="max-w-xl border dark:border-zinc-700 p-8 rounded-lg shadow-lg bg-white dark:bg-zinc-800">
			<h3 className="text-2xl font-bold mb-8 dark:text-white">
				Withdrawal Request
			</h3>
				<FormContainer
					action={async (prevState: any, formData: FormData) => {
						// Pass the updated formData to the action
						return createWithdrawalRequest(prevState, formData);
					}}>
					<div className="grid md:grid-cols-1 gap-4 mt-4">
						<FormInput
							type="number"
							name="amountWithdrawn"
							placeholder={`${formatCurrency(member.commission)}`}
							label="Amount to Withdraw"
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
						/>
						<FormInput
							type="text"
							name="bankName"
							label="Bank Name"
							defaultValue={member.bankName || ''}
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
						/>
						<FormInput
							type="text"
							name="bankAccNum"
							label="Bank Account Number"
							defaultValue={member.bankAccNum || ''}
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
						/>
						<FormInput
							type="text"
							name="bankAccName"
							label="Bank Account Name"
							defaultValue={member.bankAccName || ''}
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
						/>
                        <FormInput
							type="text"
							name="notes"
							label="Notes (Optional)"
							className={`${darkModeStyles.input} transition-colors`}
							labelClassName={darkModeStyles.label}
                            required={false}
						/>
					</div>
					<SubmitButton
						text="Submit Withdrawal Request"
						className="mt-8 w-full bg-[#C4A777] hover:bg-[#B39665] text-white py-3 rounded-lg transition-colors"
					/>
                    <div className="mt-8 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowWithdrawModal(false)}
                            className="w-full py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>

				</FormContainer>
			</div>
		</section>
        </div>
    )
}