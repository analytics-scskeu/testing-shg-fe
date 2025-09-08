export default function ColumnLineBlock({ children }) {
    return <div className={"grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8"}>{children}</div>;
}
