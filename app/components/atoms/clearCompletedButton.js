export default function ClearCompletedButton({ onClearCompleted, count }) {
    return (
        <button
            type="button"
            className="btn btn-secondary h-auto w-full px-4 py-2"
            onClick={onClearCompleted}
        >
            Clear Checked {count > 0 ? `(${count})` : ""}
        </button>
    );
}