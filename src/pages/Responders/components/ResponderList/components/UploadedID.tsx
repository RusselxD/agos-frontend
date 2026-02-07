export default function UploadedID({ imgSrc }: { imgSrc: string }) {
    return (
        <div>
            <h3 className="text-gray-500 font-medium text-sm">Uploaded ID</h3>
            <img
                src={imgSrc}
                alt="Uploaded ID"
                className="mt-1 rounded-md h-44 w-full object-cover"
            />
        </div>
    );
}
