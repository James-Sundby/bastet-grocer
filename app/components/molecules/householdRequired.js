"use client";

import { CreateOrganization, OrganizationSwitcher } from "@clerk/nextjs";
import Toast from "../atoms/toast";

export default function HouseholdRequired({
    toasts,
    afterCreateOrganizationUrl,
    afterSelectOrganizationUrl,
}) {
    return (
        <main
            className="flex flex-1 flex-col items-center bg-base-200 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:px-8 md:pt-8 md:pb-[calc(env(safe-area-inset-bottom)+2rem)]"
            role="main"
        >
            <section className="w-full max-w-xl rounded-md border border-base-300 bg-base-100 p-6 text-center">
                <h1 className="text-3xl font-bold">Create a Household</h1>

                <p className="mt-2 text-sm text-base-content/75">
                    Create or select a household before using shared grocery lists.
                </p>

                <div className="mt-6 flex justify-center">
                    <CreateOrganization
                        afterCreateOrganizationUrl={afterCreateOrganizationUrl}
                        skipInvitationScreen={false}
                    />
                </div>

                <div className="mt-6 border-t border-base-300 pt-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-base-content/60">
                        Already have one?
                    </p>

                    <div className="flex justify-center">
                        <OrganizationSwitcher
                            afterCreateOrganizationUrl={afterCreateOrganizationUrl}
                            afterSelectOrganizationUrl={afterSelectOrganizationUrl}
                        />
                    </div>
                </div>
            </section>

            <Toast toasts={toasts} />
        </main>
    );
}