import AddressFrom from "@/components/customer/company/AddressForm";
import { CompanyGoBack } from "@/components/customer/company";

export default function CreateAddress() {
    return (
        <>
            <div className="flex flex-col items-start gap-6">
                <CompanyGoBack href={"/customer/company/addresses"} translateKey={"customer.company.addresses.back"} />
                <AddressFrom />
            </div>
        </>
    );
}
