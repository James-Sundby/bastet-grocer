import { ItemsInCartIcon } from "./icons";

export default function ClearCompletedButton({ onClearCompleted, count }) {
	const itemLabel = count === 1 ? "Item " : "Items ";

	return (
		<button
			type="button"
			className="btn btn-lg lg:btn-md btn-outline btn-secondary h-auto w-full px-4 py-2"
			onClick={onClearCompleted}
		>
			<ItemsInCartIcon size="size-5" />
			Remove {count > 1 && ` ${count}`} Checked {itemLabel}
		</button>
	);
}
