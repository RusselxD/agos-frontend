interface Coordinates {
    latitude: number;
    longitude: number;
}

export const getCurrentLocation = async (): Promise<Coordinates> => {
    if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
    }

    return new Promise<Coordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                reject(new Error(`Location error: ${error.message}`));
            }
        );
    });
};
