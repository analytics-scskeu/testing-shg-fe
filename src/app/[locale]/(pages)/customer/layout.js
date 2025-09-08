import "@/resources/styles/app.scss";
import { Announcement, Greeting, Navigation } from "@/components/customer";

export default function CustomerLayout({ children }) {
    return (
        <div className="pb-8 mt-8">
            <Greeting />
            <Navigation />
            <hr className="container px-4 lg:px-6 mx-auto border-body/15 mb-6" />
            <Announcement />
            <div className="container px-4 lg:px-6 mx-auto">{children}</div>
        </div>
    );
}
