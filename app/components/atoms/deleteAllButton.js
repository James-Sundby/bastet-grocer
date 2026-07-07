export default function DeleteAllButton({ onDeleteAll }) {
    return (
        <button
            className="btn btn-error w-full btn-outline px-4 py-2 h-auto mt-4"
            onClick={onDeleteAll}
        >
            Delete All
        </button>
    );
}