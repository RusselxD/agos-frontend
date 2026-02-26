interface ErrorAlertProps {
    message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
    return (
        <p className="rounded-md border border-red-500 bg-red-100 px-3 py-2 text-sm text-red-500">
            {message}
        </p>
    );
}
