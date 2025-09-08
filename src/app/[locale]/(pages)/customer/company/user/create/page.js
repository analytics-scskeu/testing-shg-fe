import { CompanyGoBack, CompanyUserForm } from "@/components/customer/company";

export default function CompanyCreateCustomer() {
    return (
        <>
            <div className="flex flex-col items-start gap-6">
                <CompanyGoBack href={"/customer/company/index"} translateKey={"customer.company.user.back"} />
                <CompanyUserForm />
            </div>
        </>
    );
}
