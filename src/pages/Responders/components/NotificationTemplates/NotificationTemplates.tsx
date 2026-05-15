import { useEffect, useState } from "react";
import { useResponders } from "../../context/RespondersPageContext";
import Container from "../../../../components/ui/Container";
import { notificationTemplatesAPI } from "../../../../lib/api/notificationTemplate";
import NotificationTemplateCard from "./components/NotificationTemplateCard";

export default function NotificationTemplates() {
    const { cache, setCache } = useResponders();
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const fetchTemplates = async () => {
            if (cache.templates !== undefined) {
                return;
            }

            setIsFetching(true);
            try {
                const res = await notificationTemplatesAPI.getAllNotification();
                setCache((prev) => ({ ...prev, templates: res }));
            } catch (error) {
            } finally {
                setIsFetching(false);
            }
        };

        fetchTemplates();
    }, [cache.templates, setCache]);

    if (isFetching) {
        return (
            <div className="pt-4">
                <div className="skeleton rounded-md w-full h-10"></div>
                <div className="grid grid-cols-2 gap-5 mt-5">
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                </div>
            </div>
        );
    }

    return (
        <Container
            className="flex-1 relative"
            headerTitle="NOTIFICATION TEMPLATES"
        >
            <p className="text-gray-700 dark:text-slate-400 text-sm absolute top-5 right-5">
                {cache.templates?.length ?? 0} templates
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                {cache.templates?.map((template) => (
                    <NotificationTemplateCard
                        key={template.id}
                        notificationTemplate={template}
                    />
                ))}
            </div>
        </Container>
    );
}
