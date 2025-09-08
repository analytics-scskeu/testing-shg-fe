import { Deactivate, Details } from "@/components/customer/account/edit";

export default async function EditAccount() {
    return (
        <>
            <Details />
            <hr className="my-8" />
            <Deactivate />
        </>
    );
}
