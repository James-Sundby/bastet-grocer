export default function ClearCompletedButton({ onClearCompleted, count }) {
    const itemLabel = count === 1 ? "item " : "items ";

    return (
        <button
            type="button"
            className="btn btn-secondary h-auto w-full px-4 py-2"
            onClick={onClearCompleted}
        >
            Remove checked {itemLabel}{count > 1 && ` (${count})`}
        </button>
    );
}