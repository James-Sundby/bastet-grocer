export default function ClearCompletedButton({ onClearCompleted, count }) {
    const itemLabel = count === 1 ? "item " : "items ";

    return (
        <button
            type="button"
            className="btn btn-lg lg:btn-md btn-secondary h-auto w-full px-4 py-2"
            onClick={onClearCompleted}
        >
            Remove {count > 1 && ` ${count}`} checked {itemLabel}
        </button>
    );
}