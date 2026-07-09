export default function PageLoadAlert({ title, message }) {
    return (
        <section className="w-full rounded-md border border-error/30 bg-base-100 p-4">
            <div role="alert" className="alert alert-error alert-soft alert-vertical sm:alert-horizontal">
                <div>
                    <h1 className="font-bold">{title}</h1>
                    <p className="text-sm">{message}</p>
                </div>
            </div>
        </section>
    );
}