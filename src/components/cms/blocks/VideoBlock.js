export default function VideoBlock({ ...props }) {
    return (
        <div className={"relative w-full aspect-video"}>
            <iframe
                loading={"lazy"}
                className={"absolute inset-0 w-full h-full border-0"}
                src={props.src}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
}
