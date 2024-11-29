"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const firebaseSignOut = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, googleSignIn, firebaseSignOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useUserAuth = () => {
    return useContext(AuthContext);
};
