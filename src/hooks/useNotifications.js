import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteNotifications, selectorNotification } from "@/store/notification";
import Notify from "@/components/form/Notify";
import { twMerge } from "tailwind-merge";

export default function useNotifications(type = "messages") {
    const storeNotifications = useSelector(selectorNotification);
    const [notifications, setNotifications] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const getMessages = () => {
            if (storeNotifications[type]?.length) {
                setNotifications(storeNotifications[type]);
                dispatch(deleteNotifications(type));
            }
        };

        getMessages();
    });

    const RenderNotifications = ({ className, containerClassName } = {}) => {
        const containerClasses = twMerge("container-notifications flex flex-col gap-2", containerClassName);

        if (!notifications.length) return;

        return (
            <div className={containerClasses}>
                {notifications.map((notification, key) => {
                    return (
                        <Notify
                            className={className}
                            key={key}
                            type={notification.type}
                            onClose={() => {
                                setNotifications(notifications.filter((_, index) => index !== key));
                            }}
                            text={notification.message}
                        />
                    );
                })}
            </div>
        );
    };

    return { notifications, setNotifications, RenderNotifications };
}
