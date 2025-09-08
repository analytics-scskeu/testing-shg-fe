import { headers } from "next/headers";
import { serverClient } from "@/api/apolloClient";
import { GET_PAGE_BUILDER_CMS_CONTENT } from "@/api/queries/cmsBlock";
import { notFound } from "next/navigation";
import RenderBlock from "@/components/cms/RenderBlock";

export default async function Page({ params }) {
    const { slug: pageIdentifier } = await params;
    const h = await headers();
    const client = await serverClient(h);
    const { data: responseCmsPage, errors } = await client.query({
        query: GET_PAGE_BUILDER_CMS_CONTENT,
        variables: {
            slug: pageIdentifier,
        },
    });

    const content = JSON.parse(responseCmsPage?.PageBuilderCMSContent?.contentJson || null);

    if (!content || errors?.length) {
        notFound();
    }

    return (
        <div className={"md:container mx-auto mt-8"}>
            {/*<div className={"mt-8"}>*/}
            {content.map((block, index) => {
                return <RenderBlock block={block} key={index} />;
            })}
        </div>
    );
}
