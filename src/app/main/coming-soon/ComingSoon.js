function ComingSoon() {
    return (
        <div
            style={{
                padding: "0 1.5rem 0 1.5rem",
                height: "calc(100vh - 3rem)",
                overflow: "hidden",
                borderRadius: "0.5rem"
            }}
        >
            <iframe style={{
                width: '100%',
                height: '100%',
                minHeight: '100vh',
                // position: 'fixed',
                // top: 0,
                // bottom: 0,
                // left: 0,
                // right: 0,
                // zIndex: 999
            }} src="//funibox.com/funibox-coming-soon.html" frameBorder="0">
            </iframe>
        </div>
    );
}

export default ComingSoon;
