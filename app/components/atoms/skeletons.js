function PageIntroSkeleton() {
    return (
        <section className="w-full rounded-md border border-base-300 bg-base-100 p-4">
            <div className="space-y-3">
                <div className="skeleton mx-auto h-8 w-48" />
                <div className="skeleton mx-auto h-4 w-full max-w-sm" />
                <div className="skeleton mx-auto h-4 w-3/4 max-w-xs" />
                <div className="skeleton mx-auto mt-4 h-10 w-44" />
            </div>
        </section>
    );
}

function NewItemFormSkeleton() {
    return (
        <section className="w-full rounded-md">
            <div className="skeleton h-14 w-full " />
        </section>
    );
}

function SortBarSkeleton() {
    return (
        <section className="w-full rounded-md">
            <div className="grid grid-cols-2 gap-0">
                <div className="skeleton h-12 rounded-r-none" />
                <div className="skeleton h-12 rounded-l-none" />
            </div>
        </section>
    );
}

function ItemCardSkeleton() {
    return (
        <article className="card card-sm w-full border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="skeleton h-8 w-8 shrink-0 rounded-md" />

                        <div className="min-w-0 flex-1 space-y-3">
                            <div className="skeleton h-7 w-3/4" />

                            <div className="flex gap-2">
                                <div className="skeleton h-6 w-16 rounded-full" />
                                <div className="skeleton h-6 w-24 rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="skeleton h-8 w-8 shrink-0 rounded-md" />
                </div>
            </div>
        </article>
    );
}

export function GroceryPageSkeleton() {
    return (
        <main className="flex flex-1 flex-col items-center bg-base-200 p-4 md:p-8">
            <div className="flex w-full max-w-xl flex-col items-center gap-4">
                <PageIntroSkeleton />
                <NewItemFormSkeleton />
                <SortBarSkeleton />

                <div className="flex w-full flex-col gap-3">
                    <ItemCardSkeleton />
                    <ItemCardSkeleton />
                    <ItemCardSkeleton />
                </div>
            </div>
        </main>
    );
}

export function SignInSkeleton() {
    return (
        <section className="card w-full max-w-md border border-base-300 bg-base-100 shadow-xl">
            <div className="card-body items-center gap-6">
                <div className="skeleton h-24 w-24 rounded-full" />

                <div className="w-full space-y-3 text-center">
                    <div className="skeleton mx-auto h-8 w-48" />
                    <div className="skeleton mx-auto h-4 w-64 max-w-full" />
                </div>

                <div className="w-full space-y-3">
                    <div className="skeleton h-12 w-full" />
                    <div className="skeleton h-12 w-full" />
                    <div className="divider my-2" />
                    <div className="skeleton h-12 w-full" />
                </div>
            </div>
        </section>
    );
}