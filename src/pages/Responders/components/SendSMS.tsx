import { useEffect } from "react";
import { useResponders } from "../context/RespondersPageContext";
import Container from "../../../components/ui/Container";

export default function SendSMS() {
    const { cache, setCache } = useResponders();

    useEffect(() => {
        if (cache.send_sms) {
            return;
        }

        // fetch
    }, [cache.send_sms, setCache]);

    return (
        <Container>
            <p>send sms</p>
        </Container>
    );
}
