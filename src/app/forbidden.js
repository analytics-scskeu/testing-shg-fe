import { Button } from "@/components/form";

export default function Forbidden() {
    return (
        <div>
            <h2>Forbidden</h2>
            <p>You are not authorized to access this resource.</p>
            <Button className={"w-auto"} href="/">
                Return Home
            </Button>
        </div>
    );
}
