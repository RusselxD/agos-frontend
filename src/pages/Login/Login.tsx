import LoginForm from "./components/LoginForm";

const LoginHeader = () => {
    return (
        <div className="flex flex-col items-center gap-2">
            <img
                src="agos.svg"
                alt="AGOS Logo"
                className="w-16 h-16 object-cover"
            />
            <p className="font-extrabold text-5xl">LOGIN</p>
            <p className="font-semibold text-gray-700">
                PLEASE LOGIN TO YOUR ACCOUNT TO CONTINUE
            </p>
        </div>
    );
};

export default function Login() {
    return (
        <div className="flex-1 py-10 px-40 flex flex-col gap-14 items-center justify-center">
            <LoginHeader />
            <LoginForm />
        </div>
    );
}
