import { CompanyGoBack, CompanyUserForm } from "@/components/customer/company";

export default async function CompanyEditCustomer({ params }) {
    const { id } = await params;

    return (
        <>
            <div className="flex flex-col items-start gap-6">
                <CompanyGoBack href={"/customer/company/index"} translateKey={"customer.company.user.back"} />
                <CompanyUserForm customerId={id} />
            </div>
        </>
    );
}
