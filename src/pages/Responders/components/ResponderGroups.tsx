import { useEffect } from "react";
import { useResponders } from "../context/RespondersPageContext";
import Container from "../../../components/ui/Container";

export default function ResponderGroups() {
    const { cache, setCache } = useResponders();

    useEffect(() => {
        if (cache.groups) {
            return;
        }

        // fetch
    }, [cache.groups, setCache]);

    return (
        <Container>
            <p>groups</p>
        </Container>
    );
}
