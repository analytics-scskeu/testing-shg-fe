import { CompanyGeneralDetails, CompanyUsersTable } from "@/components/customer/company";

export default function Company() {
    return (
        <>
            <CompanyGeneralDetails />
            <hr className="border-primary/15 my-6" />
            <CompanyUsersTable />
        </>
    );
}
