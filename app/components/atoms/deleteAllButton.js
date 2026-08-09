export default function DeleteAllButton({ onDeleteAll }) {
    return (
        <button
            type="button"
            className="btn btn-lg lg:btn-md btn-error btn-outline h-auto w-full px-4 py-2"
            onClick={onDeleteAll}
        >
            Delete All
        </button>
    );
}