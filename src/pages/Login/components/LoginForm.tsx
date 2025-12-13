import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const RegisterAsResponder = (): React.JSX.Element => {
    return (
        <p className="w-full text-center text-sm -mt-5 font-semibold">
            <span>REGISTER AS </span>
            <NavLink to="/" className="text-accent">
                RESPONDER
            </NavLink>
        </p>
    );
};

export default function LoginForm(): React.JSX.Element {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <form
            onSubmit={(e) => handleSubmit(e)}
            className=" w-full flex flex-col gap-10"
        >
            <label className="flex flex-col">
                <span className="text-sm text-gray-700 font-semibold">
                    EMAIL
                </span>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="custom-input"
                />
            </label>
            <label className="flex flex-col">
                <span className="text-sm text-gray-700 font-semibold">
                    PASSWORD
                </span>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="custom-input"
                />
            </label>
            <button
                type="submit"
                className="bg-accent rounded-2xl py-3 px-8 text-gray-100"
            >
                Login
            </button>
            <RegisterAsResponder />
        </form>
    );
}
