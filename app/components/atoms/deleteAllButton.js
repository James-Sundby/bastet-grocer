export default function DeleteAllButton({ onDeleteAll }) {
    return (
        <div className="w-full pt-4 px-4">
            <button className="btn btn-error w-full rounded-md" onClick={onDeleteAll}>Delete All</button>
        </div>
    );
}