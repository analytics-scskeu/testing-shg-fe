"use client";

import {
    ColumnBlock,
    ColumnGroupBlock,
    ColumnLineBlock,
    RowBlock,
    TextBlock,
    ButtonsBlock,
    ButtonBlock,
    DividerBlock,
    HtmlBlock,
    ImageBlock,
    BannerBlock,
    SliderBlock,
    ProductsBlock,
    VideoBlock,
    MapBlock,
} from "@/components/cms/blocks";
import FaqBlock from "@/components/cms/blocks/FaqBlock";
import FaqItemBlock from "@/components/cms/blocks/FaqItemBlock";

const BLOCK_COMPONENTS = {
    text: TextBlock,
    row: RowBlock,
    "column-group": ColumnGroupBlock,
    "column-line": ColumnLineBlock,
    column: ColumnBlock,
    buttons: ButtonsBlock,
    "button-item": ButtonBlock,
    divider: DividerBlock,
    html: HtmlBlock,
    image: ImageBlock,
    banner: BannerBlock,
    content: TextBlock,
    slider: SliderBlock,
    products: ProductsBlock,
    video: VideoBlock,
    map: MapBlock,
    faq: FaqBlock,
    "faq-item": FaqItemBlock,
};

export default function RenderBlock({ block }) {
    const Component = BLOCK_COMPONENTS[block["data-content-type"] ?? block["class"]];

    if (Object.prototype.hasOwnProperty.call(block, "isVisible") && !block.isVisible) {
        return null;
    }

    if (!Component) {
        return null;
    }

    return (
        <>
            <Component {...block}>
                {block.items?.map((childBlock, index) => {
                    return <RenderBlock block={{ ...childBlock, index }} key={index} />;
                })}
            </Component>
        </>
    );
}
