import Image from "next/image";

export function getDisplayName(user) {
    return user?.displayName || user?.email || "User";
}

function getInitials(name) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export function UserAvatar({ user }) {
    const displayName = getDisplayName(user);

    if (user?.photoURL) {
        return (
            <div className="avatar">
                <div className="h-24 w-24 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                    <Image
                        src={user.photoURL}
                        alt=""
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="avatar avatar-placeholder">
            <div className="h-24 w-24 rounded-full bg-primary text-primary-content ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                <span className="text-3xl font-bold">{getInitials(displayName)}</span>
            </div>
        </div>
    );
}